<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\KeyFigure;
use App\Repository\KeyFigureRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class KeyFigureController extends AbstractController
{
    /**
     * @Route("/key_figure", name="key_figure_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $figures = $doctrine->getManager()
                ->getRepository(KeyFigure::class)
                ->findAll();      
            foreach ($figures as $figure) {
                $data[] = [
                    'id' => $figure->getId(),
                    'title' => $figure->getTitle(),
                    'statut' => $figure->getStatut(),
                    'koption' => $figure->getKoption(),
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/key_figure/create", name="key_figure_new", methods={"POST"})
     */
    public function new(Request $request, KeyFigureRepository $keyFigureRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $figure = new KeyFigure();
                $figure->setTitle($request->request->get('title'));
                $figure->setStatut($request->request->get('statut'));
                $koption = $request->request->get('koption');
                $figure->setKoption($koption);
                $figure->setDataAxis($request->request->get('data_axis'));
                if ($koption == 'Code') {
                    $figure->setCodeContent($request->request->get('codeContent'));
                }
                $keyFigureRepository->add($figure, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/key_figure/{id}", name="key_figure_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $figure = $doctrine->getManager()
                ->getRepository(KeyFigure::class)
                ->find($id);
            if (!$figure) {
                return $this->json('Figure introuvable : id #' . $id, 404);
            }
            $data = [
                'id' => $figure->getId(),
                'title' => $figure->getTitle(),
                'statut' => $figure->getStatut(),
                'axis' => $figure->getDataAxis(),
                'koption' => $figure->getKoption(),
                'codeContent' => $figure->getCodeContent(),
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/key_figure/edit/{id}", name="key_figure_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $figure = $entityManager->getRepository(KeyFigure::class)->find($id);
  
        if (!$figure) {
            return $this->json('Figure introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $figure->setTitle($request->request->get('title'));
                $figure->setStatut($request->request->get('statut'));
                $koption = $request->request->get('koption');
                $figure->setKoption($koption);
                $figure->setDataAxis($request->request->get('data_axis'));
                if ($koption == 'Code') {
                    $figure->setCodeContent($request->request->get('codeContent'));
                }
                $entityManager->persist($figure);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/key_figure/remove/{id}", name="key_figure_delete", methods={"DELETE"})
     */
    public function delete(int $id, KeyFigure $keyFigure, KeyFigureRepository $keyFigureRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $keyFigureRepository->remove($keyFigure, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}