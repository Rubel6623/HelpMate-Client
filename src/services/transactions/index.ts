"use server";

import { cookies } from "next/headers";

export const getMyTransactions = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/my-transactions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store",
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const getAllTransactions = async () => {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        cache: "no-store",
      });
      return await res.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };
