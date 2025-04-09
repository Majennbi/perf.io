<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'success',
            'message' => 'Perf.io API is running successfully!',
            'description' => 'This API will analyze your freelance results by fetching data from platforms like Upwork.'
        ]);
    }

    #[Route('/upwork/callback', name: 'upwork_callback', methods: ['GET', 'POST'])]
    public function upworkCallback(Request $request): JsonResponse
    {
        // Récupérer les données du callback
        $data = json_decode($request->getContent(), true) ?? $request->request->all();

        // Logique pour traiter les données d'Upwork
        // TODO: Implémenter le traitement spécifique selon la documentation d'Upwork

        // Répondre à Upwork pour confirmer la réception
        return new JsonResponse(['status' => 'success', 'message' => 'Callback received']);
    }
}
