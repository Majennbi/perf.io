import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { DashboardSection } from '@/features/dashboard/DashboardSection';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  // Ces données viendraient normalement de votre API
  const projectsData = [
    { id: 1, name: 'Site web e-commerce', client: 'Entreprise A', status: 'en_cours', dueDate: '2025-05-15' },
    { id: 2, name: 'Application mobile', client: 'Entreprise B', status: 'en_cours', dueDate: '2025-06-01' },
  ];

  const tasksData = [
    { id: 1, title: 'Maquette homepage', project: 'Site web e-commerce', status: 'a_faire', dueDate: '2025-04-25' },
    { id: 2, title: 'Intégration API paiement', project: 'Site web e-commerce', status: 'a_faire', dueDate: '2025-05-05' },
  ];

  const revenueData = {
    totalPaid: 5000,
    totalPending: 3500,
    totalOverdue: 0,
  };

  return (
    <>
      <TitleBar
        title={t('Tableau de bord')}
        description={t('Suivez vos projets clients, tâches et revenus')}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Projets en cours */}
        <DashboardSection title="Projets en cours">
          <div className="space-y-4">
            {projectsData.map(project => (
              <div key={project.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs">Échéance: {project.dueDate}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">En cours</span>
                </div>
              </div>
            ))}
            <a href="/dashboard/projects" className="block text-sm text-blue-600 hover:underline">
              Voir tous les projets →
            </a>
          </div>
        </DashboardSection>

        {/* Tâches à venir */}
        <DashboardSection title="Tâches à venir">
          <div className="space-y-4">
            {tasksData.map(task => (
              <div key={task.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">Projet: {task.project}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs">Échéance: {task.dueDate}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">À faire</span>
                </div>
              </div>
            ))}
            <a href="/dashboard/tasks" className="block text-sm text-blue-600 hover:underline">
              Voir toutes les tâches →
            </a>
          </div>
        </DashboardSection>

        {/* Revenus */}
        <DashboardSection title="Revenus">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span>Payés</span>
                <span className="font-medium">{revenueData.totalPaid} €</span>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span>En attente</span>
                <span className="font-medium">{revenueData.totalPending} €</span>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span>En retard</span>
                <span className="font-medium">{revenueData.totalOverdue} €</span>
              </div>
            </div>
            <a href="/dashboard/invoices" className="block text-sm text-blue-600 hover:underline">
              Voir toutes les factures →
            </a>
          </div>
        </DashboardSection>
      </div>
    </>
  );
};

export default DashboardIndexPage;