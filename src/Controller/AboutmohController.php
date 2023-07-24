<?php

namespace App\Controller;

use App\Entity\AboutMOH;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @Route("/api", name="api_")
 */
class AboutmohController extends AbstractController
{
    /**
     * @Route("/aboutmoh", name="app_aboutmoh", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
    	
		$stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();
    	if ($stateAuth['success']) {
    		$aboutmoh = $doctrine->getManager()
	            ->getRepository(AboutMOH::class)
	            ->findDataByCount(1);
	        if (empty($aboutmoh)) {
	        	$entityManager = $doctrine->getManager();
                $aboutmohNew = new AboutMOH();
                $entityManager->persist($aboutmohNew);
                $entityManager->flush();
	        	$aboutmoh = $doctrine->getManager()
		            ->getRepository(AboutMOH::class)
		            ->findDataByCount(1);
	        }
	        $aboutmoh = $aboutmoh[0];
    	} else {
    		$aboutmoh = $stateAuth;
    	}

        return $this->json($aboutmoh);
    }

    /**
     * @Route("/aboutmoh/maj", name="app_aboutmoh_maj", methods={"POST"})
     */
    public function maj(Request $request, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();

        $data = array();
    	if ($stateAuth['success']) {
	        $entityManager = $doctrine->getManager();
	        $aboutmoh = $entityManager->getRepository(AboutMOH::class)->findDataByCount(1);
	  
	        if (!$aboutmoh) {
	            return $this->json('Elément introuvable');
	        }

	        $aboutmoh = $entityManager->getRepository(AboutMOH::class)->findOneBy(array('id'=>$aboutmoh[0]->getId()));	         
	        if ($request->request->has('action') && $request->request->get('action') == 'maj') {
                $aboutmoh->setTextContent($request->request->get('textContent'));
                $entityManager->persist($aboutmoh);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
	        }
	    } else {
    		$data = $stateAuth;
    	}
          
        return $this->json($data);
    }
}
