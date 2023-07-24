<?php

namespace App\Controller;

use App\Entity\About;
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
class AboutController extends AbstractController
{
    /**
     * @Route("/about", name="app_about", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
    	$stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();
    	if ($stateAuth['success']) {
    		$about = $doctrine->getManager()
	            ->getRepository(About::class)
	            ->findDataByCount(1);
	        if (empty($about)) {
	        	$entityManager = $doctrine->getManager();
                $aboutNew = new About();
                $entityManager->persist($aboutNew);
                $entityManager->flush();
	        	$about = $doctrine->getManager()
		            ->getRepository(About::class)
		            ->findDataByCount(1);
	        }
	        $about = $about[0];
    	} else {
    		$about = $stateAuth;
    	}

        return $this->json($about);
    }

    /**
     * @Route("/about/maj", name="app_about_maj", methods={"POST"})
     */
    public function maj(Request $request, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
    	$stateAuth = $stateService->checkState();

        $data = array();
    	if ($stateAuth['success']) {
	        $entityManager = $doctrine->getManager();
	        $about = $entityManager->getRepository(About::class)->findDataByCount(1);
	  
	        if (!$about) {
	            return $this->json('Elément introuvable');
	        }

	        $about = $entityManager->getRepository(About::class)->findOneBy(array('id'=>$about[0]->getId()));	         
	        if ($request->request->has('action') && $request->request->get('action') == 'maj') {
                $about->setTextContent($request->request->get('textContent'));
                $entityManager->persist($about);
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
