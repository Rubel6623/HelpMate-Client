"use server";

import { cookies } from "next/headers";

export const getAllBadges = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/badges`, {
      method: "GET",
      cache: "no-store",
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getMyBadges = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-badges/my-badges`, {
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
