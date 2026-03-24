"use client";

import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string; user_metadata: { full_name: string; role: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking auth state check
    const mockUser = {
      id: "1",
      email: "citizen@example.com",
      user_metadata: {
        full_name: "Sumit Pujari",
        role: "citizen"
      }
    };

    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  return { user, loading };
};
