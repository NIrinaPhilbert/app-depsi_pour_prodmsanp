<?php

namespace App\Controller;

use App\Entity\AboutMOH;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/api", name="api_")
 */
class AboutmohFOController extends AbstractController
{
    /**
     * @Route("/aboutmoh_fo/data", name="app_aboutmoh_fo")
     */
    public function index(ManagerRegistry $doctrine): Response
    {
		$aboutmoh = $doctrine->getManager()
            ->getRepository(AboutMOH::class)
            ->findDataByCount(1);
        
        //============================//
        if (empty($aboutmoh)) {
            $oInfosNonDispo = new AboutMOH() ;
            $oInfosNonDispo->setId(0) ;
            $oInfosNonDispo->setTextContent('Information non encore enregistré') ;
            return $this->json($oInfosNonDispo);
        }
        else{
            $aboutmoh = $aboutmoh[0];

            return $this->json($aboutmoh);
            
           
        }

        //===========================//
    }
}
