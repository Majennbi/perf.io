'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

type Project = {
  id: number | string;
  name: string;
};

type TodoItem = {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  projectId: number | string | null;
  completed: boolean;
};

type WeeklyTodoListProps = {
  projectId: number | string;
  projects: Project[];
};

export const WeeklyTodoList = ({ projectId, projects }: WeeklyTodoListProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTodoProjectId, setNewTodoProjectId] = useState<string | number | null>(null);

  // Charger les todos depuis le localStorage au chargement du composant
  useEffect(() => {
    const savedTodos = localStorage.getItem(`project-${projectId}-todos`);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, [projectId]);

  // Sauvegarder les todos dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(`project-${projectId}-todos`, JSON.stringify(todos));
  }, [todos, projectId]);

  const addTodo = () => {
    if (newTodoDescription.trim() === '') return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      description: newTodoDescription,
      priority: newTodoPriority,
      projectId: newTodoProjectId,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoDescription('');
    setNewTodoPriority('medium');
    setNewTodoProjectId(null);
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodoDescription = (id: string, description: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, description } : todo
      )
    );
  };

  const updateTodoPriority = (id: string, priority: 'high' | 'medium' | 'low') => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const updateTodoProject = (id: string, projectId: number | string | null) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, projectId } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Fonction pour obtenir le nom du projet à partir de son ID
  const getProjectName = (projectId: number | string | null) => {
    if (!projectId) return 'Non assigné';
    const project = projects.find(p => p.id.toString() === projectId.toString());
    return project ? project.name : 'Non assigné';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="new-todo" className="mb-1 block text-sm font-medium">
            Nouvelle tâche
          </label>
          <Textarea
            id="new-todo"
            placeholder="Description de la tâche..."
            value={newTodoDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTodoDescription(e.target.value)}
            className="resize-none"
          />
        </div>
        <div className="w-32">
          <label htmlFor="new-todo-priority" className="mb-1 block text-sm font-medium">
            Priorité
          </label>
          <Select
            value={newTodoPriority}
            onValueChange={(value: 'high' | 'medium' | 'low') => setNewTodoPriority(value)}
          >
            <SelectTrigger id="new-todo-priority">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <label htmlFor="new-todo-project" className="mb-1 block text-sm font-medium">
            Projet
          </label>
          <Select
            value={newTodoProjectId?.toString() || 'none'}
            onValueChange={(value) => setNewTodoProjectId(value === 'none' ? null : value)}
          >
            <SelectTrigger id="new-todo-project">
              <SelectValue placeholder="Projet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Non assigné</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addTodo}>
          <PlusCircle className="mr-1 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aucune tâche pour cette semaine. Ajoutez-en une !
          </p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`rounded-lg border p-3 ${todo.completed ? 'bg-gray-50' : ''}`}>
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodoCompletion(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Textarea
                    value={todo.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateTodoDescription(todo.id, e.target.value)}
                    className={`resize-none border-none bg-transparent p-0 ${
                      todo.completed ? 'text-muted-foreground line-through' : ''
                    }`}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Projet: {getProjectName(todo.projectId)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={todo.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => updateTodoPriority(todo.id, value)}
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={todo.projectId?.toString() || 'none'}
                    onValueChange={(value) => updateTodoProject(todo.id, value === 'none' ? null : value)}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue placeholder="Projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Non assigné</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
