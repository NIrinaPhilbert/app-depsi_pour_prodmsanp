<?php

namespace App\Controller;


//============================================//
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\PostType;
use App\Repository\PostTypeRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
//============================================//

/**
 * @Route("/api", name="api_")
 */
class PostTypeController extends AbstractController
{
     
    /**
     * @Route("/post_type", name="app_post_type")
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $posttypes = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->findAll();      
            foreach ($posttypes as $post_type) {
                $data[] = [
                    'id' => $post_type->getId(),
                    'designation' => $post_type->getDesignation(),
                ];
            }
        }
  
        return $this->json($data);
    }

     /**
     * @Route("/posttype/create", name="posttype_new", methods={"POST"})
     */
    public function new(Request $request, PostTypeRepository $posttypeRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $pub = new PostType();
                $pub->setDesignation($request->request->get('designation'));
                $posttypeRepository->add($pub, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }
     /**
     * @Route("/posttype/{id}", name="posttype_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $pub = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->find($id);
            if (!$pub) {
                return $this->json('Type de publication introuvable : id #' . $id, 404);
            }
            $data = [
                'id' => $pub->getId(),
                'designation' => $pub->getDesignation(),
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/posttype/edit/{id}", name="posttype_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $pub = $entityManager->getRepository(PostType::class)->find($id);
  
        if (!$pub) {
            return $this->json('Type de publication introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $pub->setDesignation($request->request->get('designation'));
                $entityManager->persist($pub);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }
     /**
     * @Route("/posttype/remove/{id}", name="posttype_delete", methods={"DELETE"})
     */
    public function delete(int $id, PostType $posttype, PostTypeRepository $posttypeRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        $posttypeRepository->remove($posttype, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }

    /**
     * @Route("/posttypes/posttypeOptions", name="posttypeOptions_index", methods={"GET"})
     */
    public function pubOptions(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $posttypeOptions = array();
        if ($stateAuth['success']) {
            $posttypes = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->findAll();
            foreach ($posttypes as $keyPub => $posttype) {
                $posttypeOptions[] = (object) [
                    'labelKey' => $posttype->getId(),
                    'value' => $posttype->getDesignation(),
                    'isSelected' => ($keyPub == 0) ? true : false
                ];
            }
        }
  
        return $this->json($posttypeOptions);
    }

}
