import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task, CreateTaskData } from "@/types";

interface TasksQueryParams {
  project: string;
  status?: string;
  sortByDue?: "asc" | "desc";
}

export const useTasks = (params: TasksQueryParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: async (): Promise<Task[]> => {
      const searchParams = new URLSearchParams({
        project: params.project,
        sortByDue: params.sortByDue || "asc",
      });

      if (params.status) {
        searchParams.set("status", params.status);
      }

      const response = await api.get(`/tasks?${searchParams.toString()}`);
      return response.data;
    },
    enabled: !!params.project,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData): Promise<Task> => {
      const response = await api.post("/tasks", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate tasks for the specific project
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        predicate: (query) => {
          const params = query.queryKey[1] as TasksQueryParams;
          return params?.project === variables.project;
        },
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Task>;
    }): Promise<Task> => {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: (task) => {
      // Invalidate tasks for the specific project
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        predicate: (query) => {
          const params = query.queryKey[1] as TasksQueryParams;
          return params?.project === task.project;
        },
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task): Promise<void> => {
      await api.delete(`/tasks/${task._id}`);
    },
    onSuccess: (_, task) => {
      // Invalidate tasks for the specific project
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        predicate: (query) => {
          const params = query.queryKey[1] as TasksQueryParams;
          return params?.project === task.project;
        },
      });
    },
  });
};
