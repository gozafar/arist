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

  const response = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    cache,
    next
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = text && isJson ? (JSON.parse(text) as unknown) : (text as unknown);

  if (!response.ok) {
    throw new ApiResponseError({
      status: response.status,
      message: isJson && payload && typeof payload === "object" && "message" in (payload as Record<string, unknown>)
        ? String((payload as Record<string, unknown>).message)
        : response.statusText,
      details: payload
    });
  }

  return payload as T;
};
