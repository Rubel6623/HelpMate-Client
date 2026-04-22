"use client";

import { useEffect, useState } from "react";
import { getMe, getUser } from "@/src/services/auth";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decodedUser = await getUser();
        if (decodedUser) {
          const profile = await getMe();
          if (profile?.success) {
            setUser({ ...decodedUser, ...profile.data });
          } else {
            setUser(decodedUser);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
};
