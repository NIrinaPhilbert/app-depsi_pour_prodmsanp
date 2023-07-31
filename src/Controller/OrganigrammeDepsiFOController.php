<?php

namespace App\Controller;

use App\Entity\Organigrammedepsi;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/api", name="api_")
 */
class OrganigrammeDepsiFOController extends AbstractController
{
    /**
     * @Route("/organigrammedepsi_fo/data", name="app_organigrammedepsi_fo", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine): Response
    {
		$organigrammedepsi = $doctrine->getManager()
            ->getRepository(Organigrammedepsi::class)
            ->findDataByCount(1);
        if (empty($organigrammedepsi)) {
            $oInfosNonDispo = new Organigrammedepsi() ;
            $oInfosNonDispo->setId(0) ;
            $oInfosNonDispo->setTextContent('Information non encore enregistré') ;
            return $this->json($oInfosNonDispo);
        }
        else{
            $organigrammedepsi = $organigrammedepsi[0];
       
          
            return $this->json($organigrammedepsi);
            
           
        }
        

        
    }
}
