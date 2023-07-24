<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Direction;
use App\Repository\DirectionRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class DirectionController extends AbstractController
{
    /**
     * @Route("/direction", name="direction_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $dirs = $doctrine->getManager()
                ->getRepository(Direction::class)
                ->findAll();      
            foreach ($dirs as $dir) {
                $data[] = [
                    'id' => $dir->getId(),
                    'nom' => $dir->getNom(),
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/direction/create", name="direction_new", methods={"POST"})
     */
    public function new(Request $request, DirectionRepository $directionRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $dir = new Direction();
                $dir->setNom($request->request->get('nom'));
                $directionRepository->add($dir, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/direction/{id}", name="direction_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $dir = $doctrine->getManager()
                ->getRepository(Direction::class)
                ->find($id);
            if (!$dir) {
                return $this->json('Direction introuvable : id #' . $id, 404);
            }
            $data = [
                'id' => $dir->getId(),
                'nom' => $dir->getNom(),
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/direction/edit/{id}", name="direction_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $dir = $entityManager->getRepository(Direction::class)->find($id);
  
        if (!$dir) {
            return $this->json('Direction introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $dir->setNom($request->request->get('nom'));
                $entityManager->persist($dir);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/direction/remove/{id}", name="direction_delete", methods={"DELETE"})
     */
    public function delete(int $id, Direction $direction, DirectionRepository $directionRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        $directionRepository->remove($direction, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
}