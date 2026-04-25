"use server";

import { cookies } from "next/headers";

export const getSosAlerts = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sos-alerts`, {
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

export const resolveSosAlert = async (id: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sos-alerts/${id}/resolve`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const createSosAlert = async (data: { lat: number; lng: number; message?: string; taskId?: string }) => {
    const storeCookie = await cookies();
    const token = storeCookie.get("token")?.value;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sos-alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };
