'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check } from 'lucide-react';
import { LocalRevenueService, RevenueService, Project } from '@/services/revenue/revenueService';

// Props typées avec injection de dépendance pour le service
type CurrentRevenueProps = {
  revenueService?: RevenueService;
  projects?: Project[]; // Ajout des projets comme prop
};

export const CurrentRevenue = ({ 
  revenueService = new LocalRevenueService(), // Valeur par défaut pour faciliter l'utilisation
  projects = [] // Valeur par défaut pour les projets
}: CurrentRevenueProps) => {
  // États pour gérer l'UI
  const [currentRevenue, setCurrentRevenue] = useState<number>(0);
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [revenueEditValue, setRevenueEditValue] = useState<string>('0');
  
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [calculatedRevenue, setCalculatedRevenue] = useState<number>(0);
  
  // Charger les données au montage du composant et lorsque les projets changent
  useEffect(() => {
    // Récupérer les revenus actuels
    const revenue = revenueService.getCurrentMonthRevenue();
    setCurrentRevenue(revenue);
    setRevenueEditValue(revenue.toString());
    
    // Récupérer l'objectif mensuel directement depuis localStorage
    const savedGoal = localStorage.getItem('monthly-goal');
    const goalValue = savedGoal ? Number(savedGoal) : 0;
    setMonthlyGoal(goalValue);
    
    // Calculer les revenus mensuels si des projets sont fournis
    let revenueToUse = revenue;
    if (projects.length > 0) {
      const calculated = revenueService.calculateMonthlyRevenue(projects);
      setCalculatedRevenue(calculated);
      
      // Si aucun revenu n'est défini manuellement, utiliser le revenu calculé
      if (revenue === 0) {
        revenueToUse = calculated;
        setCurrentRevenue(calculated);
      }
    }
    
    // Calculer le pourcentage de progression
    const progress = goalValue > 0 
      ? Math.min(Math.round((revenueToUse / goalValue) * 100), 100)
      : 0;
    setProgressPercentage(progress);
  }, [revenueService, projects]);
  
  // Sauvegarder les revenus
  const saveRevenue = () => {
    const newRevenue = Number(revenueEditValue);
    if (!isNaN(newRevenue) && newRevenue >= 0) {
      // Utiliser le service pour mettre à jour les revenus
      try {
        (revenueService as LocalRevenueService).setCurrentMonthRevenue(newRevenue);
        setCurrentRevenue(newRevenue);
        
        // Mettre à jour le pourcentage
        const updatedProgress = monthlyGoal > 0 
          ? Math.min(Math.round((newRevenue / monthlyGoal) * 100), 100)
          : 0;
        setProgressPercentage(updatedProgress);
        
        setIsEditingRevenue(false);
      } catch (error) {
        console.error('Error saving revenue:', error);
      }
    }
  };
  
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm min-h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Revenus en cours</h3>
        {!isEditingRevenue ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setIsEditingRevenue(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={saveRevenue}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {!isEditingRevenue ? (
        <div>
          <span className="text-2xl font-bold">{currentRevenue.toLocaleString()}€</span>
          {monthlyGoal > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressPercentage}%</span>
                <span>{monthlyGoal.toLocaleString()}€</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                <div 
                  className={`h-full ${progressPercentage >= 100 ? 'bg-primary' : 'bg-secondary'}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {calculatedRevenue > 0 && calculatedRevenue !== currentRevenue && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Calculé: {calculatedRevenue.toLocaleString()}€</span>
                  <span className="block text-xs text-gray-400">Basé sur vos projets actifs</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Input
            type="number"
            value={revenueEditValue}
            onChange={(e) => setRevenueEditValue(e.target.value)}
            className="text-lg font-bold"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveRevenue();
              if (e.key === 'Escape') setIsEditingRevenue(false);
            }}
          />
          <div className="mt-1 text-xs text-muted-foreground">
            Appuyez sur Entrée pour valider
          </div>
          {calculatedRevenue > 0 && (
            <div className="mt-2 text-xs">
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs text-blue-500"
                onClick={() => {
                  setRevenueEditValue(calculatedRevenue.toString());
                }}
              >
                Utiliser le montant calculé ({calculatedRevenue.toLocaleString()}€)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
