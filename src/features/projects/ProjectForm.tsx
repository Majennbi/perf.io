'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

// Type pour les projets
export type Project = {
  id: number | string;
  name: string;
  client: string;
  status: 'planifie' | 'en_cours' | 'termine';
  startDate: string;
  dueDate: string;
  dailyRate: number;
  serviceType: string;
  rhythm: string;
  workdaysPerMonth: number;
  description: string;
};

// Type pour les nouveaux projets
export type NewProject = Omit<Project, 'id'>;

type ProjectFormProps = {
  onAddProject: (project: NewProject) => void;
};

// État initial du formulaire avec assertion de type pour garantir qu'il n'y a pas de valeurs undefined
const initialFormState: NewProject = {
  name: '',
  client: '',
  status: 'planifie' as const,
  startDate: new Date().toISOString().split('T')[0] || '',
  dueDate: '',
  dailyRate: 0,
  serviceType: '',
  rhythm: '',
  workdaysPerMonth: 0,
  description: '',
};

export const ProjectForm = ({ onAddProject }: ProjectFormProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<NewProject>(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyRate' || name === 'workdaysPerMonth' 
        ? Number(value) || 0 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({...formData});
    setFormData(initialFormState);
    setIsFormVisible(false);
  };

  if (!isFormVisible) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsFormVisible(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter un projet
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau projet</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom du projet"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Nom du client"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planifie">Planifié</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Date de fin</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Taux journalier (€)</Label>
            <Input
              id="dailyRate"
              name="dailyRate"
              type="number"
              value={formData.dailyRate}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceType">Type de prestation</Label>
            <Input
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              placeholder="Développement, Design, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rhythm">Rythme</Label>
            <Select
              value={formData.rhythm}
              onValueChange={(value) => handleSelectChange('rhythm', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rythme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temps_plein">Temps plein</SelectItem>
                <SelectItem value="mi_temps">Mi-temps</SelectItem>
                <SelectItem value="quart_temps">Quart temps</SelectItem>
                <SelectItem value="ponctuel">Ponctuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workdaysPerMonth">Jours travaillés par mois</Label>
          <Input
            id="workdaysPerMonth"
            name="workdaysPerMonth"
            type="number"
            value={formData.workdaysPerMonth}
            onChange={handleChange}
            min="0"
            max="31"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du projet"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFormVisible(false)}
          >
            Annuler
          </Button>
          <Button type="submit">Ajouter le projet</Button>
        </div>
      </form>
    </div>
  );
};
