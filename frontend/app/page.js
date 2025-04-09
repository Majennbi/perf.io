"use client";

import { useState } from "react";
import Header from "./title";
import IncomeSourceButton from "./incomeSourceButton";
import RevenueCalculation from "./revenueCalculation";
import IncomeResult from "./incomeResult";
//import ProgressBar from "./progressbar";

export default function HomePage() {
  // État partagé au niveau du composant parent (tableau au lieu de chaîne)
  const [selectedSources, setSelectedSources] = useState([]);
  const [showCalculation, setShowCalculation] = useState(false);
  const [showProgressbar, setShowProgressbar] = useState(false);
  const [revenueData, setRevenueData] = useState({});

  // Fonction qui sera passée au composant IncomeSourceButton
  function handleSourceSelection(source) {
    // Vérifie si la source est déjà sélectionnée
    if (selectedSources.includes(source)) {
      // Si oui, la retire du tableau
      setSelectedSources(selectedSources.filter((item) => item !== source));
    } else {
      // Si non, l'ajoute au tableau
      setSelectedSources([...selectedSources, source]);
    }
    setShowCalculation(true);
  }
  function handleRevenueUpdate(source, data) {
    setRevenueData((prev) => ({
      ...prev,
      [source]: data,
    }));
  }

  return (
    <div>
      <Header title="Calcule ou simule ton revenu mensuel net" as="h1" />
      <div className="main-container">
        <div className="box-container">
          <Header title="Choisis tes sources de revenus du mois" as="h2" />
          {/* On passe la fonction et l'état au composant enfant */}
          <IncomeSourceButton
            onSourceSelect={handleSourceSelection}
            selectedSources={selectedSources}
          />
        </div>

        <div className="box-container">
          <Header title="Renseigne ce que tu factures à ton client" as="h2" />
          {/* Affichage conditionnel des composants RevenueCalculation */}
          {showCalculation && selectedSources.length > 0 && (
            <div>
              {selectedSources.map((source) => (
                <RevenueCalculation
                  key={source}
                  source={source}
                  onRevenueUpdate={handleRevenueUpdate}
                />
              ))}
            </div>
          )}
        </div>

        <div className="box-container">
          <Header title="Revenus net" as="h2" />
          {/* <ProgressBar /> */}
          <IncomeResult
            selectedSources={selectedSources}
            revenueData={revenueData}
          />
        </div>
      </div>
    </div>
  );
}
