"use client";
import ProgressBar from "./progressbar";
import { useState } from "react";

export default function RevenueCalculation({ source, onRevenueUpdate }) {
  // Ajouter ces états
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");

  function handleAmountChange(value) {
    setAmount(value);
    updateParent(value, days);
  }

  function handleDaysChange(value) {
    setDays(value);
    updateParent(amount, value);
  }

  function updateParent(currentAmount = amount, currentDays = days) {
    if (onRevenueUpdate) {
      const numAmount = currentAmount === "" ? 0 : Number(currentAmount);
      const numDays = currentDays === "" ? 0 : Number(currentDays);
      onRevenueUpdate(source, { amount: numAmount, days: numDays });
    }
  }

  return (
    <div className="w-full flex">
      {source === "Malt" && (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label htmlFor="">{source} - (TJ HT attendu)</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 500"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Nombre de jour travaillés</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 15"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {source === "UpWork" && (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label htmlFor="">{source} - Montant HT</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 500"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Nombre de jour travaillés</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 15"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {source === "Direct" && (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label htmlFor="">{source} - Montant HT</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 500"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Nombre de jour travaillés</label>
            <input
              className="revenue-calculation-box"
              type="number"
              placeholder="Ex: 15"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
