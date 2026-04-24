"use server";

import { cookies } from "next/headers";

export const getMyAssignments = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignments/my-assignments`, {
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

export const getAssignmentById = async (id: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignments/${id}`, {
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

export const startAssignment = async (id: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignments/${id}/start`, {
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

export const completeAssignment = async (id: string, proofUrls: string[] = []) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignments/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ proofUrls }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const confirmAssignment = async (id: string, otp: string) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignments/${id}/confirm`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ otp }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
