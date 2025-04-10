"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function IncomeResult({
  selectedSources,
  setSelectedSources,
  setShowCalculation,
}) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [detailedCalculation, setDetailedCalculation] = useState({
    grossTotal: 0,
    afterPlatformFees: 0,
    afterTaxes: 0,
    totalDaysWorked: 0,
    tjBrut: 0,
    tjNet: 0,
    tjNetApresImpots: 0,
    platformDetails: [],
  });

  // Taux de change USD -> EUR (à mettre à jour ou à rendre dynamique si nécessaire)
  const usdToEurRate = 0.91; // 1 USD = 0.91 EUR (exemple)
  const hoursPerDay = 7; // Standard: 7 heures = 1 jour de travail

  // Taux pour les différentes déductions
  const taxRates = {
    bnc: 0.246, // Prestations de services (BNC): 24,60%
    impotRevenu: 0.022, // Versement libératoire de l'impôt sur le revenu: 2,20%
    formationPro: 0.001, // Formation professionnelle obligatoire: 0,10%
    taxeCCI: 0.0004, // Taxe CCI prestation obligatoire: 0,04%
  };

  // Calcul du taux total de déduction fiscale
  const totalTaxRate =
    taxRates.bnc +
    taxRates.impotRevenu +
    taxRates.formationPro +
    taxRates.taxeCCI;

  // Calcul des frais de plateforme
  const platformFees = {
    malt: 0.1, // 10% de frais pour Malt
    upwork: 0.1, // 10% de frais pour Upwork
    upworkService: 0.2, // 20% additionnels sur les frais Upwork
  };

  // Ajouter cette fonction dans le composant IncomeResult
  const formatNumber = (number) => {
    return number.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    let grossTotal = 0;
    let afterPlatformFees = 0;
    let totalDaysWorked = 0;
    let platformDetails = [];

    // 1. Calcul du revenu brut par source et après frais de plateforme
    selectedSources.forEach((source) => {
      let sourceGross = 0;
      let sourceNet = 0;
      let sourceDays = 0;
      let detail = { name: source.name, calculations: [] };

      if (source.name === "Malt") {
        if (source.amount && source.daysWorked) {
          sourceGross = source.amount * source.daysWorked;
          // Malt prend 10% de frais
          const maltFees = sourceGross * platformFees.malt;
          sourceNet = sourceGross - maltFees;
          sourceDays = source.daysWorked;

          detail.calculations.push(
            `${source.amount}€ × ${
              source.daysWorked
            } jours = ${sourceGross.toFixed(2)}€`,
            `Frais Malt (10%) = ${maltFees.toFixed(2)}€`,
            `Revenu après frais = ${sourceNet.toFixed(2)}€`
          );
        }
      } else if (source.name === "UpWork") {
        if (source.amount && source.hoursWorked) {
          // Calcul du montant brut en USD
          const grossUSD = source.amount * source.hoursWorked;

          // Upwork prend 10% + 20% sur ces 10% (en USD)
          const upworkBaseFeeUSD = grossUSD * platformFees.upwork;
          const upworkServiceFeeUSD =
            upworkBaseFeeUSD * platformFees.upworkService;
          const netUSD = grossUSD - upworkBaseFeeUSD - upworkServiceFeeUSD;

          // Convertir le montant NET en EUR (après déduction des frais)
          sourceGross = grossUSD * usdToEurRate; // Pour l'affichage uniquement
          sourceNet = netUSD * usdToEurRate; // Montant réellement perçu

          // Convertir les heures en jours équivalents
          sourceDays = source.hoursWorked / hoursPerDay;

          detail.calculations.push(
            `${source.amount}$ × ${
              source.hoursWorked
            } heures = ${grossUSD.toFixed(2)}$`,
            `Frais de base Upwork (10%): ${upworkBaseFeeUSD.toFixed(2)}$`,
            `Frais de service supplémentaires (20% des frais): ${upworkServiceFeeUSD.toFixed(
              2
            )}$`,
            `Total des frais Upwork: ${(
              upworkBaseFeeUSD + upworkServiceFeeUSD
            ).toFixed(2)}$`,
            `Montant net en USD: ${netUSD.toFixed(2)}$`,
            `Conversion USD → EUR (taux: ${usdToEurRate}): ${netUSD.toFixed(
              2
            )}$ = ${sourceNet.toFixed(2)}€`,
            `Heures converties en jours: ${
              source.hoursWorked
            } heures ÷ ${hoursPerDay} = ${sourceDays.toFixed(2)} jours`,
            `Revenu final après frais et conversion = ${sourceNet.toFixed(2)}€`
          );
        }
      } else if (source.name === "Direct") {
        if (source.amount && source.daysWorked) {
          sourceGross = source.amount * source.daysWorked;
          sourceNet = sourceGross; // Pas de frais pour Direct
          sourceDays = source.daysWorked;

          detail.calculations.push(
            `${source.amount}€ × ${
              source.daysWorked
            } jours = ${sourceGross.toFixed(2)}€`,
            `Pas de frais de plateforme`,
            `Revenu après frais = ${sourceNet.toFixed(2)}€`
          );
        }
      }

      grossTotal += sourceGross;
      afterPlatformFees += sourceNet;
      totalDaysWorked += sourceDays;
      platformDetails.push(detail);
    });

    // Calcul des TJ (Taux Journaliers)
    const tjBrut = totalDaysWorked > 0 ? grossTotal / totalDaysWorked : 0;
    const tjNet = totalDaysWorked > 0 ? afterPlatformFees / totalDaysWorked : 0;

    // 2. Calcul des impôts et charges sur le montant après frais de plateforme
    const afterTaxes = afterPlatformFees * (1 - totalTaxRate);
    const tjNetApresImpots =
      totalDaysWorked > 0 ? afterTaxes / totalDaysWorked : 0;

    // Mise à jour des états
    setTotalRevenue(afterTaxes);
    setDetailedCalculation({
      grossTotal: grossTotal,
      afterPlatformFees: afterPlatformFees,
      afterTaxes: afterTaxes,
      totalDaysWorked: totalDaysWorked,
      tjBrut: tjBrut,
      tjNet: tjNet,
      tjNetApresImpots: tjNetApresImpots,
      platformDetails: platformDetails,
    });
  }, [selectedSources]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="px-6">
            <div className="text-sm text-muted-foreground">Total Brut</div>
            <div className="text-2xl font-bold mt-1">
              {formatNumber(detailedCalculation.grossTotal)} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6">
            <div className="text-sm text-muted-foreground">Après frais</div>
            <div className="text-2xl font-bold mt-1">
              {formatNumber(detailedCalculation.afterPlatformFees)} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6">
            <div className="text-sm text-muted-foreground">
              Revenu Net Final
            </div>
            <div className="text-2xl font-bold mt-1 text-violet">
              {formatNumber(totalRevenue)} €
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Taux journaliers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Jours travaillés
            </div>
            <div className="text-xl font-medium">
              {formatNumber(detailedCalculation.totalDaysWorked)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">TJ Brut</div>
            <div className="text-xl font-medium">
              {formatNumber(detailedCalculation.tjBrut)} €
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              TJ Net (après frais)
            </div>
            <div className="text-xl font-medium">
              {formatNumber(detailedCalculation.tjNet)} €
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              TJ Net (après impôts)
            </div>
            <div className="text-xl font-medium">
              {formatNumber(detailedCalculation.tjNetApresImpots)} €
            </div>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="platform-details">
          <AccordionTrigger>Détail des calculs par plateforme</AccordionTrigger>
          <AccordionContent>
            {detailedCalculation.platformDetails.map((platform, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  {platform.name}
                  <Badge variant="outline" className="ml-2">
                    {platform.name === "UpWork" ? "USD → EUR" : "EUR"}
                  </Badge>
                </h4>
                <ul className="space-y-1 text-sm">
                  {platform.calculations.map((calculation, calcIndex) => (
                    <li key={calcIndex} className="text-muted-foreground">
                      {calculation}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-details">
          <AccordionTrigger>Détail des déductions fiscales</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Déduction</TableHead>
                  <TableHead>Taux</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Prestations de services BNC</TableCell>
                  <TableCell>24,60%</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(
                      detailedCalculation.afterPlatformFees * taxRates.bnc
                    )}{" "}
                    €
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Impôt sur le revenu</TableCell>
                  <TableCell>2,20%</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(
                      detailedCalculation.afterPlatformFees *
                        taxRates.impotRevenu
                    )}{" "}
                    €
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Formation professionnelle</TableCell>
                  <TableCell>0,10%</TableCell>
                  <TableCell className="text-right">
                    {(
                      detailedCalculation.afterPlatformFees *
                      taxRates.formationPro
                    ).toFixed(2)}{" "}
                    €
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Taxe CCI</TableCell>
                  <TableCell>0,04%</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(
                      detailedCalculation.afterPlatformFees * taxRates.taxeCCI
                    )}{" "}
                    €
                  </TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell>Total des déductions</TableCell>
                  <TableCell>{(totalTaxRate * 100).toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    {(
                      detailedCalculation.afterPlatformFees * totalTaxRate
                    ).toFixed(2)}{" "}
                    €
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
