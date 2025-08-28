'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, Plus, Trash2, CalendarDays } from 'lucide-react';
import { useProject } from '@/hooks/useProjects';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/hooks/useTasks';
import { useLogout } from '@/hooks/useAuth';
import { Task } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [dueDate, setDueDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortDue, setSortDue] = useState<'asc' | 'desc'>('asc');

  const projectId = id as string;

  // Queries and mutations
  const projectQuery = useProject(projectId);
  const tasksQuery = useTasks({
    project: projectId,
    status: filterStatus === 'all' ? undefined : filterStatus,
    sortByDue: sortDue,
  });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const logoutMutation = useLogout();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/login');
  }, [router]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTaskMutation.mutateAsync({
        project: projectId,
        title,
        description,
        status,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setStatus('todo');
      setDueDate('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (task: Task, patch: Partial<Task>) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task._id,
        data: { ...task, ...patch },
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTaskMutation.mutateAsync(task);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getStatusBadgeVariant = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'todo':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const applyFilters = () => {
    // Filters are automatically applied via the query when filterStatus or sortDue change
    tasksQuery.refetch();
  };

  if (projectQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectQuery.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load project</p>
          <Button onClick={() => projectQuery.refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const project = projectQuery.data;
  const tasks = tasksQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {project?.title || 'Project'}
              </h1>
            </div>
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
        {/* Create Task Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={createTaskMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={createTaskMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: Task['status']) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={createTaskMutation.isPending}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={createTaskMutation.isPending || !title.trim()}
              >
                {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort by Due Date</Label>
                <Select
                  value={sortDue}
                  onValueChange={(value: 'asc' | 'desc') => setSortDue(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={applyFilters} disabled={tasksQuery.isFetching}>
                {tasksQuery.isFetching ? 'Applying...' : 'Apply Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Loading State */}
        {tasksQuery.isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading tasks...</p>
          </div>
        )}

        {/* Tasks */}
        {!tasksQuery.isLoading && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge variant={getStatusBadgeVariant(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 mb-2">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Select
                        value={task.status}
                        onValueChange={(value: Task['status']) =>
                          updateTask(task, { status: value })
                        }
                        disabled={updateTaskMutation.isPending}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTask(task)}
                        disabled={deleteTaskMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!tasksQuery.isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No tasks yet. Create your first task above!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
