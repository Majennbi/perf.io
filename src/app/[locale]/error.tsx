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
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
        <p className="mt-2 text-muted-foreground">
          Nous sommes désolés, une erreur inattendue s'est produite.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        className="mt-4"
      >
        Réessayer
      </Button>
    </div>
  );
}
