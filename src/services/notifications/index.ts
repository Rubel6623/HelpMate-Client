"use server";

import { cookies } from "next/headers";

export const getMyNotifications = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications`, {
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

export const markNotificationAsRead = async (id: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${id}/read`, {
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

export const markAllAsRead = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark-all-read`, {
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

export const sendMessageToRunner = async (data: { runnerId: string; message: string; title?: string }) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/send-message`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
