import { LocalRevenueService } from './revenueService';

// Mock du localStorage pour les tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();

// Remplacer l'implémentation de localStorage pour les tests
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LocalRevenueService', () => {
  let service: LocalRevenueService;
  
  beforeEach(() => {
    // Réinitialiser le localStorage avant chaque test
    localStorageMock.clear();
    service = new LocalRevenueService();
  });
  
  describe('getMonthlyGoal', () => {
    test('returns 0 when no goal is set', () => {
      expect(service.getMonthlyGoal()).toBe(0);
    });
    
    test('returns the stored goal value', () => {
      localStorageMock.setItem('monthly-goal', '5000');
      expect(service.getMonthlyGoal()).toBe(5000);
    });
  });
  
  describe('setMonthlyGoal', () => {
    test('stores the goal value in localStorage', () => {
      service.setMonthlyGoal(10000);
      expect(localStorageMock.getItem('monthly-goal')).toBe('10000');
    });
    
    test('throws error for negative values', () => {
      expect(() => service.setMonthlyGoal(-100)).toThrow('Goal amount cannot be negative');
    });
  });
  
  describe('getCurrentMonthRevenue', () => {
    test('returns 0 when no revenue is set', () => {
      expect(service.getCurrentMonthRevenue()).toBe(0);
    });
    
    test('returns the stored revenue value', () => {
      localStorageMock.setItem('current-month-revenue', '3500');
      expect(service.getCurrentMonthRevenue()).toBe(3500);
    });
  });
  
  describe('getProgressPercentage', () => {
    test('returns 0 when goal is 0', () => {
      service.setCurrentMonthRevenue(1000);
      expect(service.getProgressPercentage()).toBe(0);
    });
    
    test('calculates percentage correctly', () => {
      service.setMonthlyGoal(10000);
      service.setCurrentMonthRevenue(2500);
      expect(service.getProgressPercentage()).toBe(25);
    });
    
    test('caps percentage at 100', () => {
      service.setMonthlyGoal(5000);
      service.setCurrentMonthRevenue(6000);
      expect(service.getProgressPercentage()).toBe(100);
    });
  });
});
