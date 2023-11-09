<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\DocumentaryResources;
use App\Repository\DocumentaryResourcesRepository;
use App\Entity\Entities;
use App\Entity\Direction;
use App\Entity\PostType;
use App\Entity\Themes;
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class DocumentaryResourcesFOController extends AbstractController
{
    /**
     * @Route("/docs_fo/latest/{id}/{type_affichage}", name="documentary_fo_latest", methods={"GET"})
     */
    public function latest(int $id=0, $type_affichage = 'theme', ManagerRegistry $doctrine, DocumentaryResourcesRepository $documentaryResourcesRepository): Response
    {
        //echo 'controller pour slider de theme => ' . $id ;
        //exit() ;
        $data = [];
        $docFolder = '../public/files/documentary/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);

        if($id == 0)
        {
            $docs = $doctrine->getManager()
                ->getRepository(DocumentaryResources::class)
                //->getDataByNombre(10);
                // amelioration 09082023
                ->getDataByNombre(9);
                // /. amelioration 09082023
        }
        else
        {
            if($type_affichage == 'theme')
            {
                //Critère par thème défini
                $docs = $doctrine->getManager()
                    ->getRepository(DocumentaryResources::class)
                    //->findBy($toTableauWhere, array('date' => 'DESC')); 
                    //->findAll();
                    // amelioration 0708223
                    ->findBy(["theme" => $doctrine->getManager()->getRepository(Themes::class)->find($id)], ['date' => 'DESC']) ;                
                    // /. amelioration 0708223                
            }
            else
            {
                 //Critère par thème défini
                 $docs = $doctrine->getManager()
                    ->getRepository(DocumentaryResources::class)
                    //->findBy($toTableauWhere, array('date' => 'DESC')); 
                    //->findAll();
                    // amelioration 0708223
                    ->findBy(["posttype" => $doctrine->getManager()->getRepository(PostType::class)->find($id)], ['date' => 'DESC']) ;                
                    // /. amelioration 0708223                
            }

            
            $iCompteurDocsSliderParTheme = 0 ;
            $iDocsManquantsPourSlider = 0 ;
            $tiArrayDocIdCollecte   = array() ;
            foreach($docs as $iKey => $doc)
            {
                $iCompteurDocsSliderParTheme ++ ;
                array_push($tiArrayDocIdCollecte, $doc->getId()) ;
                if($iCompteurDocsSliderParTheme > 9)
                {
                    unset($docs[$iKey]) ;
                }
            }

            if($iCompteurDocsSliderParTheme < 9)
            {
                $iDocsManquantsPourSlider = 9 - $iCompteurDocsSliderParTheme ;
                $docsManquants = $doctrine->getManager()
                    ->getRepository(DocumentaryResources::class)
                    //->getDataByNombre(10);
                    // amelioration 09082023
                    ->getDataByNombre(16); // Pour gestion des doublons (1 à 8 possible doublons)
                    // /. amelioration 09082023
                $iCompteurIncrementPourStop = 0 ;
                foreach($docsManquants as $iKeyManquant=>$docManquant)
                {
                    if(!in_array($docManquant->getId(), $tiArrayDocIdCollecte) && $iCompteurIncrementPourStop < $iDocsManquantsPourSlider)
                    {
                        array_push($docs, $docsManquants[$iKeyManquant]) ;
                        $iCompteurIncrementPourStop ++ ;
                    }
                    
                }
            } 
        }
        
        
        
        
        /*
        $posttypes = $doctrine->getManager()
            ->getRepository(PostType::class)
            ->findAll();
        */
        $posttypes = $doctrine->getManager()
            ->getRepository(PostType::class)
            ->findBy([], ['designation' => 'ASC']);
        $listPosttypes = array();      
        foreach ($posttypes as $posttype) {
            $iCompteurThemesAccessiblesDuPostType = 0 ;

            $themes = $doctrine->getManager()
                ->getRepository(Themes::class)
                ->findBy(array("posttype"=>$posttype), ['designation' => 'ASC']);
            $listThemes = array();
            foreach ($themes as $theme) {
                $iCompteurDocsDuThemeAvecPostType = 0 ;
                //REQUETE where posttype_id =  $posttype->getId() and theme_id = $theme->getId()
                $docsPosttypeTheme = $doctrine->getManager()
                    ->getRepository(DocumentaryResources::class)
                    ->findBy(["theme" => $theme->getId(), "posttype" => $posttype->getId()]);
                //Si existe => $iCompteurDocsDuThemeAvecPostType = nombre résultat
                $iCompteurDocsDuThemeAvecPostType = count($docsPosttypeTheme) ;
                                
                if($iCompteurDocsDuThemeAvecPostType > 0)
                {
                    $listThemes[] = [
                        'id' => $theme->getId(),
                        'designation' => $theme->getDesignation()
                    ];
                    $iCompteurThemesAccessiblesDuPostType ++ ;
                }
            }
            if($iCompteurThemesAccessiblesDuPostType > 0)
            {
                $listPosttypes[] = [
                    'id' => $posttype->getId(),
                    'designation' => $posttype->getDesignation(),
                    'themes' => $listThemes
                ];
            }
            
        }
        foreach ($docs as $doc) {
            $data[] = [
                'id' => $doc->getId(),
                'title' => $doc->getTitle(),
                'imageFile' => !is_null($doc->getCover()) && !empty($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                'imageName' => !is_null($doc->getCover()) && !empty($doc->getCover()) ? $doc->getCover() : '',
                'textContent' => ''
            ];
        }
  
        //return $this->json($data);
        // amelioration 07082023
        return $this->json(array("data"=>$documentaryResourcesRepository->groupArrayPerNumber($data, 3), "posttypes"=>$listPosttypes));
        // /. amelioration 07082023

    }

    /**
     * @Route("/docs_fo/list/{id}/{type_affichage}", name="documentary_fo_index", methods={"GET"})
     */
    public function index(int $id = 0, $type_affichage = '', ManagerRegistry $doctrine): Response
    {
        
        $data = [];
        
        $docFolder = '../public/files/documentary/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
        
        if($type_affichage != '')
        {
            $docs = $doctrine->getManager()
                ->getRepository(DocumentaryResources::class)
                //->findBy($toTableauWhere, array('date' => 'DESC')); 
                //->findAll();
                // amelioration 0708223
                ->findBy($type_affichage == 'theme' ? ["theme" => $doctrine->getManager()->getRepository(Themes::class)->find($id)] : ["posttype" => $doctrine->getManager()->getRepository(PostType::class)->find($id)], ['date' => 'DESC']);
                // /. amelioration 0708223
        }
        else
        {
            $docs = $doctrine->getManager()
                ->getRepository(DocumentaryResources::class)
                //->findBy($toTableauWhere, array('date' => 'DESC')); 
                //->findAll();
                // amelioration 0708223
                ->findBy([], ['date' => 'DESC']);
                // /. amelioration 0708223
        }
        
        foreach ($docs as $doc) {
            $docFiles = array();
            $docNames = array();
            if (!is_null($doc->getDocument())) {
                $files = json_decode($doc->getDocument());
                foreach ($files as $key => $value) {
                    if (file_exists($docFolder.$value)) {
                        $docFiles[] = str_replace("../public/", "/", $docFolder).$value;
                        $docNames[] = $value;
                    }
                }
            }
            $data[] = [
                'id' => $doc->getId(),
                'title' => $doc->getTitle(),
                'coverFile' => !is_null($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                'coverName' => !is_null($doc->getCover()) ? $doc->getCover() : '',
                'docFiles' => $docFiles,
                'docNames' => !empty($docNames) ? $docNames : '',
                'titleText' => $doc->getTitle(),
                //'date' => $doc->getDate()->format('d/m/Y'),
                // amelioration 0708223
                'date' => $doc->getDate()->format('Y-m-d'),
                // /. amelioration 0708223
                'author' => $doc->getAuthor(),
                //'pub_type' => $doc->getPubType(),
                'pub_type' => $doc->getPostType()->getDesignation(),
                'direction' => $doc->getDirection()->getNom(),
                'entities' => $doc->getEntities()->getName(),
                //'thematic' => $doc->getThematic(),
                'thematic' => $doc->getThemes()->getDesignation(),
                'documentAccess' => $doc->getDocumentAccess()
            ];
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/docs_fo/{id}", name="documentary_fo_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine): Response
    {
        $data = [];
        $docFolder = '../public/files/documentary/';
        $doc = $doctrine->getManager()
            ->getRepository(DocumentaryResources::class)
            ->find($id);
        if (!$doc) {
            return $this->json('Ressource introuvable : id #' . $id, 404);
        }
        $documentAccessOptions = array();
        $document_access_keys = explode('|', $_ENV['DOCUMENT_ACCESS_KEYS']);
        $document_access_values = explode('|', $_ENV['DOCUMENT_ACCESS_VALUES']);
        foreach ($document_access_keys as $keyAccess => $valueAccessKey) {
            $documentAccessOptions[] = (object) [
                'labelKey' => $document_access_keys[$keyAccess],
                'value' => $document_access_values[$keyAccess],
                'isSelected' => ($valueAccessKey == $doc->getDocumentAccess()) ? true : false
            ];
        }
        $docIcons = array();
        $docFiles = array();
        $docNames = array();
        $docSizes = array();
        if (!is_null($doc->getDocument())) {
            $files = json_decode($doc->getDocument());
            foreach ($files as $key => $value) {
                if (file_exists($docFolder.$value)) {
                    $docIcons[] = (!is_null($value) ? '/resources/img/icons/' . explode('.', $value)[count(explode('.', $value))-1] : 'zip') . '-icon.png';
                    $docFiles[] = str_replace("../public/", "/", $docFolder).$value;
                    $docNames[] = $value;
                    $docSizes[] = !is_null($value) ? $doctrine->getManager()->getRepository(DocumentaryResources::class)->getDynamicFileSize($docFolder.$value) : '';
                }
            }
        }
        $data = [
            'id' => $doc->getId(),
            'title' => $doc->getTitle(),
            'summary' => $doc->getSummary(),
            'coverFile' => !is_null($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
            'coverName' => !is_null($doc->getCover()) ? $doc->getCover() : '',
            'docIcons' => $docIcons,
            'docFiles' => $docFiles,
            'docNames' => !empty($docNames) ? $docNames : '',
            'docSizes' => $docSizes,
            'date' => $doc->getDate()->format('d/m/Y'),
            'author' => $doc->getAuthor(),
            //'pub_type' => $doc->getPubType(),
            'pub_type' => $doc->getPostType()->getDesignation(),
            'direction' => $doc->getDirection()->getNom(),
            'entities' => $doc->getEntities()->getName(),
            //'thematic' => $doc->getThematic(),
            'thematic' => $doc->getThemes()->getDesignation(),
            'documentAccess' => $doc->getDocumentAccess(),
            'documentAccessOptions' => $documentAccessOptions
        ];
          
        return $this->json($data);
    }
  
}