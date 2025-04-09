"use client";

import { useState } from "react";

export default function ProgressBar({ onWorkdaysChange }) {
  const [workdays, setWorkdays] = useState(0);
  const maxDays = 31; // Nombre moyen de jours ouvrables dans un mois

  // Calculer le pourcentage pour la barre de progression
  const progressPercentage = Math.min((workdays / maxDays) * 100, 100);

  const handleIncrement = () => {
    if (workdays < maxDays) {
      const newValue = workdays + 1;
      setWorkdays(newValue);
      if (onWorkdaysChange) onWorkdaysChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (workdays > 0) {
      const newValue = workdays - 1;
      setWorkdays(newValue);
      if (onWorkdaysChange) onWorkdaysChange(newValue);
    }
  };

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setWorkdays(newValue);
    if (onWorkdaysChange) onWorkdaysChange(newValue);
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Jours travaillés: {workdays}/{maxDays}
        </span>
      </div>

      {/* Slider pour sélection rapide */}
      <input
        type="range"
        min="0"
        max={maxDays}
        value={workdays}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
}
