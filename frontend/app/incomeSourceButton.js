"use client";

import { Button } from "@/components/ui/button";

export default function IncomeSourceButton({
  onSourceSelect,
  selectedSources,
}) {
  const sources = ["Malt", "UpWork", "Direct"];

  function handleClick(source) {
    onSourceSelect(source);
  }

return (
  <div className="flex flex-wrap gap-2">
    {sources.map((source) => {
      const isSelected = selectedSources.some(
        (selected) => selected.name === source
      );

      return (
        <Button
          key={source}
          onClick={() => handleClick(source)}
          variant={isSelected ? "default" : "outline"}
          className={`min-w-24 rounded-full transition-all hover:translate-y-[-2px] ${
            isSelected
              ? "bg-primary text-white shadow-md shadow-primary/30"
              : "bg-primary/90 text-white border-primary/20 hover:bg-primary/20"
          }`}
        >
          {source}
        </Button>
      );
    })}
  </div>
);
}
