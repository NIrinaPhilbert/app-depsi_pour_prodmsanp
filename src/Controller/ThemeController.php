<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
//============================================//
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\PostType;
use App\Entity\Themes;
use App\Repository\ThemesRepository;
use App\Repository\PostTypeRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
//=============================================//

/**
 * @Route("/api", name="api_")
 */
class ThemeController extends AbstractController
{
    
    /**
     * @Route("/themes", name="themes_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $themes = $doctrine->getManager()
                ->getRepository(Themes::class)
                ->findAll();      
            foreach ($themes as $theme) {
                $data[] = [
                    'id' => $theme->getId(),
                    'type_publication' => $theme->getPosttype()->getDesignation(),
                    'designation' => $theme->getDesignation(),
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/themes/posttypeOptions", name="thposttypeOptions_index", methods={"GET"})
     */
    public function posttypeOptions(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $posttypeOptions = array();
        if ($stateAuth['success']) {
            $posttypes = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->findAll();
            foreach ($posttypes as $keyPostType => $posttype) {
                $posttypeOptions[] = (object) [
                    'labelKey' => $posttype->getId(),
                    'value' => $posttype->getDesignation(),
                    'isSelected' => ($keyPostType == 0) ? true : false
                ];
            }
        }
  
        return $this->json($posttypeOptions);
    }
    /**
     * @Route("/themes/create", name="themes_new", methods={"POST"})
     */
    public function new(Request $request, ThemesRepository $themesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $theme = new Themes();
                $theme->setPostType($doctrine->getRepository(PostType::class)->find($request->request->get('posttype')));
                $theme->setDesignation($request->request->get('designation'));
                $themesRepository->add($theme, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }
    /**
     * @Route("/themes/{id}", name="themes_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $theme = $doctrine->getManager()
                ->getRepository(Themes::class)
                ->find($id);
            if (!$theme) {
                return $this->json('Thèmatique introuvable : id #' . $id, 404);
            }
            $posttypeOptions = array();
            $posttypes = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->findAll();
            foreach ($posttypes as $keyPub => $posttype) {
                $posttypeOptions[] = (object) [
                    'labelKey' => $posttype->getId(),
                    'value' => $posttype->getDesignation(),
                    'isSelected' => ($posttype->getId() == $theme->getPostType()->getId()) ? true : false
                ];
            }
            $data = [
                'id' => $theme->getId(),
                'posttype' => $theme->getPostType()->getId(),
                'posttypeOptions' => $posttypeOptions,
                'designation' => $theme->getDesignation(),
               
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/themes/themesOptions/{id}", name="themesOptions_index", methods={"POST"})
     */
    public function themesOptions(int $id, Request $request, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $themesOptions = array();
        if ($stateAuth['success']) {
            
            $themes = $doctrine->getManager()
                ->getRepository(Themes::class)
                ->findBy(array('posttype' => $doctrine->getManager()->getRepository(PostType::class)->find($id)));
            
            foreach ($themes as $keyTheme => $theme) {
                $themesOptions[] = (object) [
                    'labelKey' => $theme->getId(),
                    'value' => $theme->getDesignation(),
                    //'isSelected' => ($keyTheme == 0) ? true : false
                    'isSelected' => ($keyTheme == 0 && (!$request->request->has("themes") || is_null($request->request->get("themes")) || empty($request->request->get("themes")))) || (($request->request->has("themes") && !is_null($request->request->get("themes")) && !empty($request->request->get("themes"))) && $theme->getId() == $request->request->get("themes")) ? true : false
                ];
            }
            /*
            
            $themesOptions[] = (object) [
                'labelKey' => 1,
                'value' => "exemple ici",
                'isSelected' => true
            ];
            */
            
        }
  
        return $this->json($themesOptions);
    }

    /**
     * @Route("/themes/edit/{id}", name="themes_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $themeManager = $doctrine->getManager();
        $theme = $themeManager->getRepository(Themes::class)->find($id);
  
        if (!$theme) {
            return $this->json('Thèmatique introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $theme->setPostType($doctrine->getRepository(PostType::class)->find($request->request->get('posttype')));
                $theme->setDesignation($request->request->get('designation'));
                $themeManager->persist($theme);
                $themeManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/themes/remove/{id}", name="themes_delete", methods={"DELETE"})
     */
    public function delete(int $id, Themes $themes, ThemesRepository $themesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        $themesRepository->remove($themes, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
    

}
