// lib/fetch-client.ts
import { getSession } from "./session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  
  if (session) {
    headers.set("Authorization", `Bearer ${session.user.id}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}





// A wrapper around the native fetch API to provide a more convenient interface
// and centralize API logic, similar to an Axios instance.

import { cookies } from "next/headers";

// 1. Define the base URL for the API.
// const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

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
  const userId = cookieStore.get("userId")?.value || null;

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

  // If a userId exists, add it to the custom 'x-user-id' header.
  if (userId) {
    headers.set("x-user-id", userId);
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
      console.error("API Error Response:", errorData);
      // Throw an error to be caught by the calling function's catch block.
      throw errorData as unknown;
    }

    // If the response is successful, parse the JSON body and return it.
    const data = (await response.json()) as T;
    // console.log(data, "API response");
    return data;

  } catch (error) {
    console.error("Unexpected Error:", error);
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
  // You can add other methods like patch, head, etc., as needed.
};

export default client;

/*
//   // HOW TO USE IT IN YOUR NEXT.JS COMPONENTS/PAGES:

//   import client from './path/to/your/client';

//   // Example GET request in a Server Component or Client Component
//   const fetchUsers = async () => {
//     try {
//       // The 'next' object allows you to control caching behavior.
//       // For example, revalidate every 60 seconds.
//       const users = await client.get('users', { next: { revalidate: 60 } });
//       console.log(users);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   };

//   // Example POST request in a Client Component
//   const createUser = async (userData) => {
//     try {
//       const newUser = await client.post('users', userData);
//       console.log('User created:', newUser);
//     } catch (error) {
//       console.error("Failed to create user:", error);
//     }
//   };
// */
