export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  project: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: Task["status"];
  project: string;
  dueDate?: string;
}
