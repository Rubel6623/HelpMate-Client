"use server";

import { cookies } from "next/headers";

/**
 * Unified Proxy Fetch Wrapper for Server Actions
 * Handles: Base URL, Authorization, JSON Content-Type, and Error Catching
 */
export const proxyFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_BASE_URL is not defined. Defaulting to local backend.");
  }

  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  // Set default headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Attach token if available
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Merge with user-provided options
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Default to no-cache for server fetches to ensure data freshness
    cache: options.cache || "no-store",
  };

  // Normalize URL
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;

  try {
    const res = await fetch(url, config);

    // Handle 204 No Content
    if (res.status === 204) {
      return { success: true, data: null };
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error(`[ProxyFetch Error] ${endpoint}:`, error.message);
    return {
      success: false,
      message: error.message || "Failed to connect to the server",
    };
  }
};
