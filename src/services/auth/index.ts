"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    const storeCookie = await cookies();

    if (result.success) {
      storeCookie.set("token", result?.data?.token);
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An unexpected error occurred"
    };
  }
};

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  exp?: number;
  iat?: number;
}

export const getUser = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  let decodedData: CustomJwtPayload | null = null;
  if (token) {
    decodedData = jwtDecode<CustomJwtPayload>(token);
    
    // Check if token has expired
    if (decodedData.exp && decodedData.exp < Date.now() / 1000) {
      return null;
    }
    
    return decodedData;
  } else {
    return null;
  }
};

export const getMe = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Get profile failed:", text);
        try {
            const errorData = JSON.parse(text);
            return errorData;
        } catch(e) {
            return {
                success: false,
                message: `Server returned ${res.status}: ${text.slice(0, 100)}`
            };
        }
    }

    return await res.json();

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch profile",
    };
  }
};

export const updateProfile = async (data: any) => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/me`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Profile update failed:", text);
        try {
            const errorData = JSON.parse(text);
            return errorData;
        } catch(e) {
            return {
                success: false,
                message: `Server returned ${res.status}: ${text.slice(0, 100)}`
            };
        }
    }

    return await res.json();

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};

export const UserLogOut = async () => {

  const storeCookie = await cookies();
  storeCookie.delete("token");
};