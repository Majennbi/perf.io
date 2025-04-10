"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RevenueCalculation({ source, updateSource }) {
    const handleAmountChange = (e) => {
      updateSource(source.name, { amount: parseFloat(e.target.value) });
    };

    const handleDaysWorkedChange = (e) => {
      updateSource(source.name, { daysWorked: parseInt(e.target.value, 10) });
    };

    const handleHoursWorkedChange = (e) => {
      updateSource(source.name, { hoursWorked: parseInt(e.target.value, 10) });
    };

  return (
    <div className="w-full flex">
      {source.name === "Malt" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-amount`}>
              {source.name} - (TJ HT attendu)
            </Label>
            <Input
              id={`${source.name}-amount`}
              type="number"
              placeholder="Ex: 500"
              onChange={handleAmountChange}
              value={source.amount || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-days`}>
              Nombre de jours travaillés
            </Label>
            <Input
              id={`${source.name}-days`}
              type="number"
              placeholder="Ex: 15"
              onChange={handleDaysWorkedChange}
              value={source.daysWorked || ""}
            />
          </div>
        </div>
      )}

      {source.name === "UpWork" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-amount`}>
              {source.name} - Tarif horaire HT
            </Label>
            <Input
              id={`${source.name}-amount`}
              type="number"
              placeholder="Ex: 50"
              onChange={handleAmountChange}
              value={source.amount || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-hours`}>
              {source.name} - Nombre d'heures travaillées
            </Label>
            <Input
              id={`${source.name}-hours`}
              type="number"
              placeholder="Ex: 40"
              onChange={handleHoursWorkedChange}
            />
          </div>
        </div>
      )}

      {source.name === "Direct" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-amount`}>
              {source.name} - Montant HT
            </Label>
            <Input
              id={`${source.name}-amount`}
              type="number"
              placeholder="Ex: 450"
              onChange={handleAmountChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${source.name}-days`}>
              {source.name} - Nombre de jour travaillés
            </Label>
            <Input
              id={`${source.name}-days`}
              type="number"
              placeholder="Ex: 15"
              onChange={handleDaysWorkedChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
