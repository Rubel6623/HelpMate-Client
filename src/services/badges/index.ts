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

export const getBadges = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/badges`, {
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

export const createBadge = async (badgeData: any) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/badges`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(badgeData),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const updateBadge = async (badgeId: string, badgeData: any) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/badges/${badgeId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(badgeData),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteBadge = async (badgeId: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/badges/${badgeId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
