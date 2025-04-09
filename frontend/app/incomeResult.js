"use client";

import { useState, useEffect } from "react";

export default function IncomeResult({ selectedSources, revenueData }) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  // Calculer le total chaque fois que revenueData change
  useEffect(() => {
    if (!revenueData) return;

    let revenue = 0;
    let days = 0;

    // Parcourir toutes les sources sélectionnées
    selectedSources.forEach((source) => {
      if (revenueData[source]) {
        const { amount, days: workdays } = revenueData[source];
        if (amount && workdays) {
          revenue += amount * workdays;
          days += workdays;
        }
      }
    });

    setTotalRevenue(revenue);
    setTotalDays(days);
  }, [revenueData, selectedSources]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Résumé des revenus</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">Total jours travaillés</p>
          <p className="text-2xl font-bold">{totalDays} jours</p>
        </div>

        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">Revenu total (HT)</p>
          <p className="text-2xl font-bold">
            {totalRevenue.toLocaleString("fr-FR")} €
          </p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-gray-600">Revenu journalier moyen (HT)</p>
        <p className="text-2xl font-bold">
          {totalDays > 0
            ? (totalRevenue / totalDays).toLocaleString("fr-FR", {
                maximumFractionDigits: 2,
              })
            : 0}{" "}
          € / jour
        </p>
      </div>
    </div>
  );
}
