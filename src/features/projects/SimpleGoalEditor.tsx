'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, Target } from 'lucide-react';

export const SimpleGoalEditor = () => {
  const [goal, setGoal] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('0');

  // Charger l'objectif au montage du composant
  useEffect(() => {
    const savedGoal = localStorage.getItem('monthly-goal');
    const goalValue = savedGoal ? Number(savedGoal) : 0;
    setGoal(goalValue);
    setEditValue(goalValue.toString());
  }, []);

  // Sauvegarder l'objectif
  const saveGoal = () => {
    const newGoal = Number(editValue);
    if (!isNaN(newGoal) && newGoal >= 0) {
      // Sauvegarder dans localStorage
      localStorage.setItem('monthly-goal', newGoal.toString());
      console.log('Objectif mensuel sauvegardé:', newGoal);
      
      // Mettre à jour l'état local
      setGoal(newGoal);
      
      // Fermer le mode édition
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm min-h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="h-4 w-4 mr-1 text-muted-foreground" />
          <h3 className="text-sm font-medium">Objectif mensuel</h3>
        </div>
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
        <div>
          <span className="text-2xl font-bold">{goal.toLocaleString()}€</span>
        </div>
      ) : (
        <div>
          <Input
            type="number"
            value={editValue}
            onChange={(e) => {
              console.log('Nouvelle valeur d\'objectif:', e.target.value);
              setEditValue(e.target.value);
            }}
            className="text-lg font-bold"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                saveGoal();
              }
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <div className="mt-1 text-xs text-muted-foreground">
            Appuyez sur Entrée pour valider
          </div>
          <Button 
            className="mt-2 w-full"
            size="sm"
            onClick={saveGoal}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
};
