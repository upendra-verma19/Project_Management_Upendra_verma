import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AuthResponse, LoginData, RegisterData } from "@/types";
import useAuthStore from "@/store/authStore";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Could add a logout API call here if needed
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data on logout
    },
  });
};
