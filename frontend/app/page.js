"use client";

import { useState } from "react";
import Header from "./title";
import IncomeSourceButton from "./incomeSourceButton";
import RevenueCalculation from "./revenueCalculation";
import IncomeResult from "./incomeResult";
import "./globals.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {

  // État partagé au niveau du composant parent (tableau au lieu de chaîne)
  const [selectedSources, setSelectedSources] = useState([]);
  const [showCalculation, setShowCalculation] = useState(false);

function handleSourceSelection(sourceName) {
  if (selectedSources.some((source) => source.name === sourceName)) {
    setSelectedSources(
      selectedSources.filter((source) => source.name !== sourceName)
    );
  } else {
    // Initialisation différente selon la source
    if (sourceName === "UpWork") {
      setSelectedSources([
        ...selectedSources,
        { name: sourceName, amount: 0, hoursWorked: 0 },
      ]);
    } else {
      setSelectedSources([
        ...selectedSources,
        { name: sourceName, amount: 0, daysWorked: 0 },
      ]);
    }
  }
  setShowCalculation(true);
}

  function updateSource(sourceName, updates) {
    setSelectedSources((prevSources) =>
      prevSources.map((source) =>
        source.name === sourceName ? { ...source, ...updates } : source
      )
    );
  }
return (
  <div className="container max-w-4xl mx-auto p-6">
    <div className="title-container mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center">
        <span className="block">Perf.io</span>
        <span className="text-2xl md:text-3xl font-medium block mt-2 text-violet">Pilote ton activité comme un pro</span>
      </h1>
    </div>

    <div className="flex flex-col gap-10 mt-8">
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Choisis tes sources de revenus du mois</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <IncomeSourceButton
            onSourceSelect={handleSourceSelection}
            selectedSources={selectedSources}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Renseigne ce que tu factures à ton client</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          {showCalculation && selectedSources.length > 0 && (
            <div className="space-y-4">
              {selectedSources.map((source) => (
                <div key={source.name}>
                  <h3 className="font-medium mb-2">{source.name}</h3>
                  <RevenueCalculation
                    source={source}
                    updateSource={updateSource}
                  />
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Revenus net</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <IncomeResult
            selectedSources={selectedSources}
            setSelectedSources={setSelectedSources}
            setShowCalculation={setShowCalculation}
          />
        </CardContent>
      </Card>
    </div>
  </div>
);
}
