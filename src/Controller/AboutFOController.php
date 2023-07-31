<?php

namespace App\Controller;

use App\Entity\About;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/api", name="api_")
 */
class AboutFOController extends AbstractController
{
    /**
     * @Route("/about_fo/data", name="app_about_fo", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine): Response
    {
		$about = $doctrine->getManager()
            ->getRepository(About::class)
            ->findDataByCount(1);
        //=============================//
        if (empty($about)) {
            $oInfosNonDispo = new About() ;
            $oInfosNonDispo->setId(0) ;
            $oInfosNonDispo->setTextContent('Information non encore enregistré') ;
            return $this->json($oInfosNonDispo);
        }
        else{
            $about = $about[0];
            return $this->json($about);
            
           
        }

    }
}
