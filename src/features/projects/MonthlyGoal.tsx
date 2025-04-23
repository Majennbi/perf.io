'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check } from 'lucide-react';

export const MonthlyGoal = () => {
  const [goal, setGoal] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('0');
  
  // Récupérer l'objectif sauvegardé au chargement
  useEffect(() => {
    const savedGoal = localStorage.getItem('monthly-goal');
    if (savedGoal) {
      setGoal(Number(savedGoal));
      setEditValue(savedGoal);
    }
  }, []);
  
  // Sauvegarder l'objectif dans le localStorage
  const saveGoal = () => {
    const newGoal = Number(editValue);
    if (!isNaN(newGoal) && newGoal >= 0) {
      setGoal(newGoal);
      localStorage.setItem('monthly-goal', newGoal.toString());
      setIsEditing(false);
    }
  };
  
  // Calculer le pourcentage d'avancement (simulé pour l'exemple)
  // Dans une version réelle, ce serait calculé à partir des factures du mois en cours
  const currentProgress = 7500; // Exemple: 7500€ réalisés ce mois-ci
  const progressPercentage = goal > 0 ? Math.min(Math.round((currentProgress / goal) * 100), 100) : 0;
  
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm min-h-[100%]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Objectif mensuel</h3>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={saveGoal}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {!isEditing ? (
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{goal.toLocaleString()}€</span>
            <span className="text-sm font-medium text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {currentProgress.toLocaleString()}€ / {goal.toLocaleString()}€
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-lg font-bold"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveGoal();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <div className="mt-1 text-xs text-muted-foreground">
            Appuyez sur Entrée pour valider
          </div>
        </div>
      )}
    </div>
  );
};
