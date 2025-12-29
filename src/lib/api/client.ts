type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  authToken?: string;
};

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export class ApiResponseError extends Error {
  status: number;
  details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiResponseError";
    this.status = error.status;
    this.details = error.details;
  }
}

const defaultHeaders = {
  "Content-Type": "application/json"
};

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const refreshToken = async (): Promise<void> => {
  const response = await fetch(`${getBaseUrl()}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }
};

const waitForRefresh = (): Promise<void> => {
  return new Promise((resolve) => {
    refreshQueue.push(resolve);
  });
};

export const apiFetch = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const { method = "GET", body, headers = {}, cache, next, authToken } = options;
  const base = getBaseUrl();
  const url = `${base}${path}`;
  
  // Handle FormData differently
  const isFormData = body instanceof FormData;
  const mergedHeaders: Record<string, string> = { 
    ...defaultHeaders, 
    ...headers 
  };

  // Remove Content-Type for FormData (browser sets it automatically)
  if (isFormData) {
    delete mergedHeaders["Content-Type"];
  }

  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }

  const makeRequest = async (): Promise<Response> => {
    return fetch(url, {
      method,
      headers: mergedHeaders,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      cache,
      next,
      credentials: "include",
    });
  };

  return new Promise(async (resolve, reject) => {
    let response = await makeRequest();

    // Handle 401 - try to refresh token (ONLY for auth errors)
    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true;
      
      try {
        await refreshToken();
        isRefreshing = false;
        
        // Resolve all queued requests
        refreshQueue.forEach(resolve => resolve());
        refreshQueue = [];
        
        // Retry original request
        response = await makeRequest();
      } catch (refreshError) {
        isRefreshing = false;
        refreshQueue.forEach(resolve => resolve());
        refreshQueue = [];
        reject(refreshError);
        return;
      }
    } else if (response.status === 401 && isRefreshing) {
      // Wait for refresh to complete
      await waitForRefresh();
      response = await makeRequest();
    }

    const text = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = text && isJson ? (JSON.parse(text) as unknown) : (text as unknown);

    // For non-401 errors, throw immediately (including 404)
    if (!response.ok) {
      throw new ApiResponseError({
        status: response.status,
        message: (() => {
          const record = isJson && payload && typeof payload === "object" 
            ? payload as Record<string, unknown> 
            : null;
          return record?.message as string || record?.error as string || response.statusText;
        })(),
        details: payload
      });
    }

    resolve(payload as T);
  });
};
