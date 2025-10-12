// A wrapper around the native fetch API to provide a more convenient interface
// and centralize API logic, similar to an Axios instance.

import { cookies } from "next/headers";

// 1. Define the base URL for the API.
const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

// Next.js-specific fetch options (subset)
type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

// Extend RequestInit to allow Next.js 'next' option as well
export interface ApiFetchOptions extends RequestInit {
  next?: NextFetchOptions;
}

// Narrow route type for readability
type Route = string;

// 2. Define a generic request function that handles the core fetch logic.
const request = async <T = unknown>(
  route: Route,
  options: ApiFetchOptions = {}
): Promise<T> => {
  if (!BASE_URL) {
    throw new Error("Base URL is not defined in NEXT_PUBLIC_API_URL");
  }

  // Server-side: read cookies via next/headers
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  // Initialize headers if they don't exist in options
  let headers: Headers;
  if (!options.headers) {
    headers = new Headers();
  } else if (options.headers instanceof Headers) {
    headers = options.headers;
  } else {
    headers = new Headers(options.headers as Record<string, string>);
  }

  // If a token exists, add it to the Authorization header.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure Content-Type for JSON requests if not already set and body is not FormData
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  options.headers = headers;

  // Construct the full URL
  const url = `${BASE_URL}/${route}`;

  try {
    const response = await fetch(url, options);

    // The fetch API doesn't throw an error for HTTP error statuses (like 404 or 500).
    // So, we need to check the 'ok' status and handle it manually.
    if (!response.ok) {
      // Try to parse the error response body
      const errorData = (await response
        .json()
        .catch(() => ({ message: response.statusText }))) as unknown;
      // console.error("API Error Response:", errorData);
      // Throw an error to be caught by the calling function's catch block.
      throw errorData as unknown;
    }

    // If the response is successful, parse the JSON body and return it.
    const data = (await response.json()) as T;
    return data;

  } catch (error) {
    // console.error("Unexpected Error:", error);
    // Re-throw the error so it can be handled by the component.
    // This makes sure that both network errors and our custom thrown errors are caught.
    throw error;
  }
};

// 3. Create an 'client' object with methods for each HTTP verb.
// This provides a clean, Axios-like interface.
const client = {
  get: <T = any>(route: Route, options: ApiFetchOptions = {}) => {
    return request<T>(route, { ...options, method: "GET" });
  },
  post: <T = any>(
    route: Route,
    body?: unknown | FormData,
    options: ApiFetchOptions = {}
  ) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const finalOptions: ApiFetchOptions = {
      ...options,
      method: "POST",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    };
    // If sending FormData, let the browser set Content-Type with boundary
    if (isFormData && finalOptions.headers instanceof Headers) {
      finalOptions.headers.delete("Content-Type");
    }
    return request<T>(route, finalOptions);
  },
  put: <T = any>(
    route: Route,
    body?: unknown | FormData,
    options: ApiFetchOptions = {}
  ) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const finalOptions: ApiFetchOptions = {
      ...options,
      method: "PUT",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    };
    if (isFormData && finalOptions.headers instanceof Headers) {
      finalOptions.headers.delete("Content-Type");
    }
    return request<T>(route, finalOptions);
  },
  delete: <T = any>(route: Route, options: ApiFetchOptions = {}) => {
    return request<T>(route, { ...options, method: "DELETE" });
  },
  patch: <T = any>(route: Route, body?: unknown | FormData, options: ApiFetchOptions = {}) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const finalOptions: ApiFetchOptions = {
      ...options,
      method: "PATCH",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    };
    if (isFormData && finalOptions.headers instanceof Headers) {
      finalOptions.headers.delete("Content-Type");
    }
    return request<T>(route, finalOptions);
  },
};

export default client;



