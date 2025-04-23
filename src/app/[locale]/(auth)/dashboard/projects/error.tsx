'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">Une erreur est survenue</h2>
      <p className="mb-6 text-muted-foreground">
        Désolé, nous n'avons pas pu charger la page des projets.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Réessayer
      </Button>
    </div>
  );
}