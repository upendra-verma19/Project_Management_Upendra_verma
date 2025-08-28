"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Plus, ExternalLink, Trash2 } from "lucide-react";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { useLogout } from "@/hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const projectsQuery = useProjects();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const logoutMutation = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createProjectMutation.mutateAsync({ title, description });
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProjectMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (projectsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projectsQuery.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load projects</p>
          <Button onClick={() => projectsQuery.refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const projects = projectsQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Project Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project title"
                    required
                    disabled={createProjectMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    disabled={createProjectMutation.isPending}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={createProjectMutation.isPending || !title.trim()}
              >
                {createProjectMutation.isPending
                  ? "Creating..."
                  : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Link href={`/projects/${project._id}`}>
                    <Button className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProject(project._id)}
                    disabled={deleteProjectMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No projects yet. Create your first project above!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
