<?php

namespace App\Controller;

use App\Entity\Projects;
use App\Repository\SkillsRepository;
use App\Repository\ProjectsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\SerializationContext;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ProjectController extends AbstractController
{
    #[Route('/api/projects', name: 'project', methods: ['GET'])]
    public function getAllProjects(
        ProjectsRepository $projectsRepository,
        SerializerInterface $serializer,
        Request $request,
        TagAwareCacheInterface $cache
    ): JsonResponse {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 3);

        $idCache = 'getAllProjects-' . $page . '-' . $limit;

        $jsonAllProjects = $cache->get($idCache, function (ItemInterface $item) use (
            $projectsRepository,
            $page,
            $limit,
            $serializer
        ) {
            echo ("L'élément n'est pas en cache");
            $item->tag("projectsCache");
            $allProjects = $projectsRepository->findAllWithPagination($page, $limit);
            $context = SerializationContext::create()->setGroups(['getProjects']);
            return $serializer->serialize($allProjects, 'json', $context);
        });

        return new JsonResponse(
            $jsonAllProjects,
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/api/projects/{id}', name: 'projectById', methods: ['GET'])]
    public function getProjectById(int $id, ProjectsRepository $projectsRepository, SerializerInterface $serializer): JsonResponse
    {
        $project = $projectsRepository->find($id);
        if (!$project) {
            throw new NotFoundHttpException('Project not found');
        }

        $context = SerializationContext::create()->setGroups(['getProjects']);
        $jsonProject = $serializer->serialize($project, 'json', $context);
        return new JsonResponse(
            $jsonProject,
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/api/projects/{id}', name: 'deleteProject', methods: ['DELETE'])]
    public function deleteProject(
        int $id,
        ProjectsRepository $projectsRepository,
        EntityManagerInterface $em,
        TagAwareCacheInterface $cache
    ): JsonResponse {
        $project = $projectsRepository->find($id);
        if (!$project) {
            throw new NotFoundHttpException('Project not found');
        }
        $cache->invalidateTags(["projectsCache"]);
        $em->remove($project);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[IsGranted('ROLE_ADMIN', message: 'Only admin can add a project')]
    #[Route('/api/projects', name: 'addProject', methods: ['POST'])]
    public function addProject(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        UrlGeneratorInterface $urlGenerator,
        SkillsRepository $skillsRepository,
        ValidatorInterface $validator
    ): JsonResponse {
        $context = SerializationContext::create()->setGroups(['getProjects']);

        $project = $serializer->deserialize($request->getContent(), Projects::class, 'json', $context);

        $errors = $validator->validate($project);

        if ($errors->count() > 0) {
            $jsonErrors = $serializer->serialize($errors, 'json', $context);
            return new JsonResponse($jsonErrors, JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        // Récupération de l'ensemble des données envoyées sous forme de tableau
        $content = $request->toArray();

        // Récupération de l'idSkills. S'il n'est pas défini, alors on met -1 par défaut.
        $idSkills = $content['idSkills'] ?? -1;

        // On cherche le skill correspondant à l'idSkills et on l'ajoute au projet
        // Si "find" ne trouve pas de skill correspondant, alors $skill sera null
        $skills = $skillsRepository->find($idSkills);
        if ($skills) {
            $project->setSkills(new ArrayCollection([$skills]));
        } else {
            $project->setSkills(new ArrayCollection());
        }

        $em->persist($project);
        $em->flush();

        $jsonProject = $serializer->serialize($project, 'json', $context);

        $location = $urlGenerator->generate(
            'projectById',
            ['id' => $project->getId()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        return new JsonResponse($jsonProject, Response::HTTP_CREATED, ["Location" => $location], true);
    }

    #[Route('/api/projects/{id}', name: 'updateProject', methods: ['PUT'])]
    public function updateProject(
        Request $request,
        SerializerInterface $serializer,
        Projects $currentProject,
        EntityManagerInterface $em,
        SkillsRepository $skillsRepository,
        ValidatorInterface $validator
    ): JsonResponse {
        $context = SerializationContext::create()->setGroups(['getProjects']);

        $updatedProject = $serializer->deserialize(
            $request->getContent(),
            Projects::class,
            'json',
            [AbstractNormalizer::OBJECT_TO_POPULATE => $currentProject]
        );

        $errors = $validator->validate($updatedProject);

        if ($errors->count() > 0) {
            $jsonErrors = $serializer->serialize($errors, 'json', $context);
            return new JsonResponse($jsonErrors, JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $content = $request->toArray();
        $idSkills = $content['idSkills'] ?? -1;
        $skills = $skillsRepository->find($idSkills);
        if ($skills) {
            $updatedProject->setSkills(new ArrayCollection([$skills]));
        } else {
            $updatedProject->setSkills(new ArrayCollection());
        }

        $em->persist($updatedProject);
        $em->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
