'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        Désolé, nous n'avons pas pu charger les détails de ce projet.
      </p>
      <div className="flex space-x-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Réessayer
        </Button>
        <Link href="/dashboard/projects">
          <Button variant="outline">Retour à la liste des projets</Button>
        </Link>
      </div>
    </div>
  );
}