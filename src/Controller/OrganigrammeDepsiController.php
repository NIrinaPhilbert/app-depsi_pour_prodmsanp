<?php

namespace App\Controller;

use App\Entity\Organigrammedepsi;
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
class OrganigrammeDepsiController extends AbstractController
{
    /**
     * @Route("/organigrammedepsi", name="app_organigrammedepsi", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
    	$stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();
    	if ($stateAuth['success']) {
    		$organigrammedepsi = $doctrine->getManager()
	            ->getRepository(Organigrammedepsi::class)
	            ->findDataByCount(1);
	        if (empty($organigrammedepsi)) {
	        	$entityManager = $doctrine->getManager();
                $organigrammedepsiNew = new Organigrammedepsi();
                $entityManager->persist($organigrammedepsiNew);
                $entityManager->flush();
	        	$organigrammedepsi = $doctrine->getManager()
		            ->getRepository(Organigrammedepsi::class)
		            ->findDataByCount(1);
	        }
	        $organigrammedepsi = $organigrammedepsi[0];
    	} else {
    		$organigrammedepsi = $stateAuth;
    	}

        return $this->json($organigrammedepsi);
    }

    /**
     * @Route("/organigrammedepsi/maj", name="app_organigrammedepsi_maj", methods={"POST"})
     */
    public function maj(Request $request, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();

        $data = array();
    	if ($stateAuth['success']) {
	        $entityManager = $doctrine->getManager();
	        $organigrammedepsi = $entityManager->getRepository(Organigrammedepsi::class)->findDataByCount(1);
	  
	        if (!$organigrammedepsi) {
	            return $this->json('Elément introuvable');
	        }

	        $organigrammedepsi = $entityManager->getRepository(Organigrammedepsi::class)->findOneBy(array('id'=>$organigrammedepsi[0]->getId()));	         
	        if ($request->request->has('action') && $request->request->get('action') == 'maj') {
                $organigrammedepsi->setTextContent($request->request->get('textContent'));
                $entityManager->persist($organigrammedepsi);
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
