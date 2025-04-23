'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { WeeklyTodoList } from '@/features/projects/WeeklyTodoList';
import { CurrentRevenue } from '@/features/projects/CurrentRevenue';
import { SimpleGoalEditor } from '@/features/projects/SimpleGoalEditor';
import { ProjectForm, Project, NewProject } from '@/features/projects/ProjectForm';

// Données initiales pour les projets
const initialProjectsData = [
  {
    id: 1,
    name: 'Site web e-commerce',
    client: 'Entreprise A',
    status: 'en_cours',
    startDate: '2025-03-15',
    dueDate: '2025-05-15',
    dailyRate: 450,
    serviceType: 'Développement web',
    rhythm: 'Mi-temps',
    workdaysPerMonth: 10,
    description: 'Création d\'un site e-commerce complet avec système de paiement intégré.',
  },
  {
    id: 2,
    name: 'Application mobile',
    client: 'Entreprise B',
    status: 'en_cours',
    startDate: '2025-04-01',
    dueDate: '2025-06-01',
    dailyRate: 500,
    serviceType: 'Développement mobile',
    rhythm: 'Temps plein',
    workdaysPerMonth: 20,
    description: 'Développement d\'une application mobile iOS et Android pour la gestion de stocks.',
  },
  {
    id: 3,
    name: 'Refonte site vitrine',
    client: 'Entreprise C',
    status: 'termine',
    startDate: '2025-01-10',
    dueDate: '2025-02-28',
    dailyRate: 400,
    serviceType: 'Design UI/UX',
    rhythm: 'Ponctuel',
    workdaysPerMonth: 5,
    description: 'Refonte complète du site vitrine avec nouveau design et optimisation SEO.',
  },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Project | null>(null);

  // Charger les projets depuis localStorage au chargement initial
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(initialProjectsData as Project[]);
      localStorage.setItem('projects', JSON.stringify(initialProjectsData));
    }
  }, []);

  // Filtrer les projets en fonction du statut sélectionné
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  // Fonction pour mettre à jour le statut d'un projet
  const handleStatusChange = (projectId: number | string, newStatus: 'planifie' | 'en_cours' | 'termine') => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, status: newStatus } : project
    );

    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // Fonction pour ajouter un nouveau projet
  const handleAddProject = (newProject: NewProject) => {
    const projectWithId = {
      ...newProject,
      id: Date.now(), // Utiliser un timestamp comme ID temporaire
    };

    const updatedProjects = [...projects, projectWithId];
    setProjects(updatedProjects);

    // Sauvegarder dans localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // Fonction pour commencer l'édition d'un projet
  const startEditing = (project: Project) => {
    setEditingProject(project.id as number);
    setEditFormData({ ...project });
  };

  // Fonction pour annuler l'édition
  const cancelEditing = () => {
    setEditingProject(null);
    setEditFormData(null);
  };

  // Fonction pour gérer les changements dans le formulaire d'édition
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editFormData) return;

    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'dailyRate' || name === 'workdaysPerMonth'
        ? Number(value) || 0
        : value
    });
  };

  // Fonction pour gérer les changements de sélection
  const handleEditSelectChange = (name: string, value: string) => {
    if (!editFormData) return;

    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Fonction pour sauvegarder les modifications
  const saveProjectChanges = (projectId: number | string) => {
    if (!editFormData) return;

    const updatedProjects = projects.map(project =>
      project.id === projectId ? editFormData : project
    );

    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setEditingProject(null);
    setEditFormData(null);
  };

  return (
    <div className="space-y-6">
      <TitleBar title="Gestion des projets" />

      {/* Section des revenus actuels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex">
          <div className="flex-1">
            <CurrentRevenue projects={projects} />
          </div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <SimpleGoalEditor />
          </div>
        </div>
      </div>

      {/* Section de la liste des projets */}
      <DashboardSection title="Mes projets">
        <div className="space-y-4">
          {/* Formulaire d'ajout de projet */}
          <ProjectForm onAddProject={handleAddProject} />

          {/* Filtres de projets */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={filter === 'planifie' ? 'default' : 'outline'}
              onClick={() => setFilter('planifie')}
            >
              Planifiés
            </Button>
            <Button
              variant={filter === 'en_cours' ? 'default' : 'outline'}
              onClick={() => setFilter('en_cours')}
            >
              En cours
            </Button>
            <Button
              variant={filter === 'termine' ? 'default' : 'outline'}
              onClick={() => setFilter('termine')}
            >
              Terminés
            </Button>
          </div>

          {/* Tableau des projets */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Projet</th>
                  <th className="text-left py-2 px-4">Client</th>
                  <th className="text-left py-2 px-4">Statut</th>
                  <th className="text-left py-2 px-4">TJ (€)</th>
                  <th className="text-left py-2 px-4">Jours/mois</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    {editingProject === project.id ? (
                      // Mode édition
                      <>
                        <td className="py-2 px-4">
                          <Input
                            name="name"
                            value={editFormData?.name || ''}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            name="client"
                            value={editFormData?.client || ''}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <Select
                            value={editFormData?.status || 'planifie'}
                            onValueChange={(value) => handleEditSelectChange('status', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planifie">Planifié</SelectItem>
                              <SelectItem value="en_cours">En cours</SelectItem>
                              <SelectItem value="termine">Terminé</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            name="dailyRate"
                            type="number"
                            value={editFormData?.dailyRate || 0}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <Input
                            name="workdaysPerMonth"
                            type="number"
                            value={editFormData?.workdaysPerMonth || 0}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="py-2 px-4 flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveProjectChanges(project.id)}
                          >
                            Enregistrer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Annuler
                          </Button>
                        </td>
                      </>
                    ) : (
                      // Mode affichage
                      <>
                        <td className="py-2 px-4 cursor-pointer" onClick={() => startEditing(project)}>
                          {project.name}
                        </td>
                        <td className="py-2 px-4 cursor-pointer" onClick={() => startEditing(project)}>
                          {project.client}
                        </td>
                        <td className="py-2 px-4">
                          <Select
                            value={project.status}
                            onValueChange={(value) => handleStatusChange(project.id, value as 'planifie' | 'en_cours' | 'termine')}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planifie">Planifié</SelectItem>
                              <SelectItem value="en_cours">En cours</SelectItem>
                              <SelectItem value="termine">Terminé</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-4 cursor-pointer" onClick={() => startEditing(project)}>
                          {project.dailyRate}
                        </td>
                        <td className="py-2 px-4 cursor-pointer" onClick={() => startEditing(project)}>
                          {project.workdaysPerMonth}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(project)}
                          >
                            Modifier
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardSection>

      {/* Section de la liste des tâches hebdomadaires */}
      <DashboardSection title="Tâches hebdomadaires">
        <WeeklyTodoList projectId="global" projects={projects} />
      </DashboardSection>
    </div>
  );
};

export default ProjectsPage;