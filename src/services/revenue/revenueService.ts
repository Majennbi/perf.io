// Interface pour définir le contrat du service de revenus
export interface RevenueService {
  getCurrentMonthRevenue(): number;
  getMonthlyGoal(): number;
  setMonthlyGoal(amount: number): void;
  getProgressPercentage(): number;
  calculateMonthlyRevenue(projects: Project[]): number;
}

// Type pour les projets (à adapter selon votre modèle)
export type Project = {
  id: number | string;
  dailyRate: number;
  workdaysPerMonth: number;
  status: string;
};

// Implémentation utilisant le localStorage (pourrait être remplacée par une API)
export class LocalRevenueService implements RevenueService {
  private readonly GOAL_KEY = 'monthly-goal';
  private readonly CURRENT_REVENUE_KEY = 'current-month-revenue';
  
  getCurrentMonthRevenue(): number {
    const savedRevenue = localStorage.getItem(this.CURRENT_REVENUE_KEY);
    return savedRevenue ? Number(savedRevenue) : 0;
  }
  
  getMonthlyGoal(): number {
    const savedGoal = localStorage.getItem(this.GOAL_KEY);
    return savedGoal ? Number(savedGoal) : 0;
  }
  
  setMonthlyGoal(amount: number): void {
    if (amount < 0) throw new Error('Goal amount cannot be negative');
    localStorage.setItem(this.GOAL_KEY, amount.toString());
  }
  
  getProgressPercentage(): number {
    const goal = this.getMonthlyGoal();
    if (goal <= 0) return 0;
    
    const revenue = this.getCurrentMonthRevenue();
    return Math.min(Math.round((revenue / goal) * 100), 100);
  }
  
  // Méthode pour simuler l'ajout de revenus (dans une vraie application, 
  // cela viendrait des factures payées)
  setCurrentMonthRevenue(amount: number): void {
    if (amount < 0) throw new Error('Revenue amount cannot be negative');
    localStorage.setItem(this.CURRENT_REVENUE_KEY, amount.toString());
  }
  
  // Nouvelle méthode pour calculer les revenus mensuels en fonction des projets
  calculateMonthlyRevenue(projects: Project[]): number {
    // Filtrer les projets en cours uniquement
    const activeProjects = projects.filter(project => project.status === 'en_cours');
    
    // Calculer le revenu mensuel total
    const totalRevenue = activeProjects.reduce((sum, project) => {
      const monthlyRevenue = project.dailyRate * project.workdaysPerMonth;
      return sum + monthlyRevenue;
    }, 0);
    
    return totalRevenue;
  }
}
