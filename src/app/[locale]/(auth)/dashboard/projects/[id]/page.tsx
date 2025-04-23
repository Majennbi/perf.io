import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { DashboardSection } from '@/features/dashboard/DashboardSection';

// Cette fonction serait normalement utilisée pour récupérer les données du projet
// à partir de l'ID dans les paramètres de l'URL
const getProjectById = (id: string) => {
  // Simulons des données pour l'exemple
  return {
    id: parseInt(id),
    name: 'Site web e-commerce',
    client: 'Entreprise A',
    status: 'en_cours',
    startDate: '2025-03-15',
    dueDate: '2025-05-15',
    budget: 8000,
    description: 'Création d\'un site e-commerce complet avec système de paiement intégré. Le site comprendra un catalogue produits, un système de panier, une passerelle de paiement sécurisée et un espace client.',
    tasks: [
      { id: 1, title: 'Maquette homepage', status: 'termine', dueDate: '2025-03-25' },
      { id: 2, title: 'Intégration API paiement', status: 'a_faire', dueDate: '2025-05-05' },
      { id: 3, title: 'Développement backend', status: 'en_cours', dueDate: '2025-04-15' },
    ],
    invoices: [
      { id: 1, number: 'FACT-2025-001', amount: 4000, status: 'payee', date: '2025-03-20' },
      { id: 2, number: 'FACT-2025-002', amount: 4000, status: 'en_attente', date: '2025-05-20' },
    ]
  };
};

// Cette fonction serait normalement utilisée pour récupérer les données du client
// à partir de l'ID du projet
const getClientByProjectId = (projectId: string) => {
  // Simulons des données pour l'exemple
  // Utilisation du paramètre projectId pour montrer qu'il est utilisé
  console.log(`Récupération du client pour le projet ${projectId}`);
  return {
    id: 1,
    name: 'Entreprise A',
    contact: 'Jean Dupont',
    email: 'jean.dupont@entreprisea.com',
    phone: '01 23 45 67 89',
  };
};

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  // Suppression de la variable t non utilisée
  
  // Récupération des données du projet et du client
  const project = getProjectById(params.id);
  const client = getClientByProjectId(params.id);

  // Fonction pour obtenir la classe CSS en fonction du statut de tâche
  const getTaskStatusClass = (status: string) => {
    switch (status) {
      case 'a_faire':
        return 'bg-amber-100 text-amber-800';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'termine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le libellé en français du statut de tâche
  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case 'a_faire':
        return 'À faire';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la classe CSS en fonction du statut de facture
  const getInvoiceStatusClass = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-amber-100 text-amber-800';
      case 'payee':
        return 'bg-green-100 text-green-800';
      case 'retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le libellé en français du statut de facture
  const getInvoiceStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'payee':
        return 'Payée';
      case 'retard':
        return 'En retard';
      default:
        return status;
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/projects" className="mr-4 text-sm text-blue-600 hover:underline">
          ← Retour aux projets
        </Link>
        <TitleBar
          title={project.name}
          description={`Projet pour ${project.client}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardSection title="Informations du projet">
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{project.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                  <p className="mt-1">{project.startDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                  <p className="mt-1">{project.dueDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p className="mt-1">{project.budget} €</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className="mt-1">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      project.status === 'en_cours' ? 'bg-blue-100 text-blue-800' : 
                      project.status === 'termine' ? 'bg-green-100 text-green-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {project.status === 'en_cours' ? 'En cours' : 
                       project.status === 'termine' ? 'Terminé' : 'En pause'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </DashboardSection>

          <DashboardSection title="Tâches">
            <div className="flex justify-between">
              <h3 className="mb-4 text-lg font-medium">Liste des tâches</h3>
              <Button size="sm">Ajouter une tâche</Button>
            </div>
            <div className="rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tâche
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Échéance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {project.tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {task.title}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`rounded-full px-2 py-1 text-xs ${getTaskStatusClass(task.status)}`}>
                          {getTaskStatusLabel(task.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {task.dueDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <DashboardSection title="Factures">
            <div className="flex justify-between">
              <h3 className="mb-4 text-lg font-medium">Liste des factures</h3>
              <Button size="sm">Créer une facture</Button>
            </div>
            <div className="rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      N° Facture
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {project.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {invoice.number}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {invoice.amount} €
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`rounded-full px-2 py-1 text-xs ${getInvoiceStatusClass(invoice.status)}`}>
                          {getInvoiceStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {invoice.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">Voir</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>

        <div>
          <DashboardSection title="Informations client">
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                <p className="mt-1">{client.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1">{client.contact}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{client.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1">{client.phone}</p>
              </div>
              <div className="pt-2">
                <Link href={`/dashboard/clients/${client.id}`} className="text-sm text-blue-600 hover:underline">
                  Voir la fiche client complète
                </Link>
              </div>
            </div>
          </DashboardSection>

          <DashboardSection title="Actions">
            <div className="space-y-2">
              <Button className="w-full">Modifier le projet</Button>
              <Button variant="outline" className="w-full">Marquer comme terminé</Button>
              <Button variant="destructive" className="w-full">Supprimer</Button>
            </div>
          </DashboardSection>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;