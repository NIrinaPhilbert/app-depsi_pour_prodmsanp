<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Entities;
use App\Entity\Direction;
use App\Repository\EntitiesRepository;
use App\Repository\DirectionRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class EntitiesController extends AbstractController
{
    /**
     * @Route("/entitys", name="entitys_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $entities = $doctrine->getManager()
                ->getRepository(Entities::class)
                ->findAll();      
            foreach ($entities as $entity) {
                $data[] = [
                    'id' => $entity->getId(),
                    'direction' => $entity->getDirection()->getNom(),
                    'name' => $entity->getName(),
                    'description' => $entity->getDescription(),
                    'createdAt' => $entity->getCreatedAt()->format('d/m/Y'),
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/entitys/directionOptions", name="entitysOptions_index", methods={"GET"})
     */
    public function dirOptions(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $directionOptions = array();
        if ($stateAuth['success']) {
            $directions = $doctrine->getManager()
                ->getRepository(Direction::class)
                ->findAll();
            foreach ($directions as $keyDir => $direction) {
                $directionOptions[] = (object) [
                    'labelKey' => $direction->getId(),
                    'value' => $direction->getNom(),
                    'isSelected' => ($keyDir == 0) ? true : false
                ];
            }
        }
  
        return $this->json($directionOptions);
    }

    /**
     * @Route("/entitys/create", name="entitys_new", methods={"POST"})
     */
    public function new(Request $request, EntitiesRepository $entitiesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $entity = new Entities();
                $entity->setDirection($doctrine->getRepository(Direction::class)->find($request->request->get('direction')));
                $entity->setName($request->request->get('name'));
                $entity->setDescription($request->request->get('description'));
                $entity->setCreatedAt(new \DateTime(date('Y-m-d H:i:s')));
                $entitiesRepository->add($entity, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/entitys/{id}", name="entitys_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $entity = $doctrine->getManager()
                ->getRepository(Entities::class)
                ->find($id);
            if (!$entity) {
                return $this->json('Entité introuvable : id #' . $id, 404);
            }
            $directionOptions = array();
            $directions = $doctrine->getManager()
                ->getRepository(Direction::class)
                ->findAll();
            foreach ($directions as $keyDir => $direction) {
                $directionOptions[] = (object) [
                    'labelKey' => $direction->getId(),
                    'value' => $direction->getNom(),
                    'isSelected' => ($direction->getId() == $entity->getDirection()->getId()) ? true : false
                ];
            }
            $data = [
                'id' => $entity->getId(),
                'direction' => $entity->getDirection()->getId(),
                'directionOptions' => $directionOptions,
                'name' => $entity->getName(),
                'description' => $entity->getDescription(),
                'createdAt' => $entity->getCreatedAt()->format('d/m/Y'),
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/entitys/entitiesOptions/{id}", name="entitiesOptions_index", methods={"GET"})
     */
    public function entitysOptions(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entitiesOptions = array();
        if ($stateAuth['success']) {
            $entities = $doctrine->getManager()
                ->getRepository(Entities::class)
                ->findBy(array('direction' => $doctrine->getManager()->getRepository(Direction::class)->find($id)));
            foreach ($entities as $keyEntity => $entity) {
                $entitiesOptions[] = (object) [
                    'labelKey' => $entity->getId(),
                    'value' => $entity->getName(),
                    'isSelected' => ($keyEntity == 0) ? true : false
                ];
            }
        }
  
        return $this->json($entitiesOptions);
    }

    /**
     * @Route("/entitys/edit/{id}", name="entitys_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $entity = $entityManager->getRepository(Entities::class)->find($id);
  
        if (!$entity) {
            return $this->json('Entité introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $entity->setDirection($doctrine->getRepository(Direction::class)->find($request->request->get('direction')));
                $entity->setName($request->request->get('name'));
                $entity->setDescription($request->request->get('description'));
                $entity->setCreatedAt(new \DateTime(date('Y-m-d H:i:s')));
                $entityManager->persist($entity);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/entitys/remove/{id}", name="entitys_delete", methods={"DELETE"})
     */
    public function delete(int $id, Entities $entities, EntitiesRepository $entitiesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        $entitiesRepository->remove($entities, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}