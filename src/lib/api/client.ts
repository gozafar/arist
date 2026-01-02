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

export const apiFetch = async <T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers = {}, cache, next, authToken } = options;

  const base = getBaseUrl();
  const url = `${base}${path}`;

  const isFormData = body instanceof FormData;

  const mergedHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

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
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache,
      next,
      credentials: "include",
    });
  };

  let response = await makeRequest();

  /* ================= 401 HANDLING ================= */
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        await refreshToken();
      } finally {
        isRefreshing = false;
        refreshQueue.forEach(resolve => resolve());
        refreshQueue = [];
      }

      response = await makeRequest();
    } else {
      await waitForRefresh();
      response = await makeRequest();
    }
  }

  /* ================= RESPONSE PARSING ================= */
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = text && isJson
    ? (JSON.parse(text) as unknown)
    : (text as unknown);

  /* ================= ERROR HANDLING ================= */
  if (!response.ok) {
    throw new ApiResponseError({
      status: response.status,
      message: (() => {
        const record =
          isJson && payload && typeof payload === "object"
            ? (payload as Record<string, unknown>)
            : null;

        return (
          (record?.message as string) ||
          (record?.error as string) ||
          response.statusText
        );
      })(),
      details: payload,
    });
  }

  return payload as T;
};
