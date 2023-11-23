<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Visitor;
use App\Entity\Home;
use App\Repository\HomeRepository;
use App\Entity\PostType;
use App\Entity\Themes;
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class HomeFOController extends AbstractController
{
    /**
     * @Route("/home_fo", name="home_fo_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        // evol nombre de visiteurs 10082023
        $isIpVisitorExist = count($entityManager
                    ->getRepository(Visitor::class)
                    ->findByIp($_SERVER['REMOTE_ADDR'], date("Y-m-d"))) > 0 ? true : false;
        if (!$isIpVisitorExist) {
            $visitor = new Visitor();
            $visitor->setInfos("IP " . $_SERVER['REMOTE_ADDR'] . "; " . $_SERVER['HTTP_USER_AGENT']);
            $visitor->setCreatedAt(new \DateTime(date('Y-m-d H:i:s')));
            $entityManager->persist($visitor);
            $entityManager->flush();
        }
        // /. evol nombre de visiteurs 10082023
        $data = [];
        $docFolder = '../public/files/home/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
        $docs = $doctrine->getManager()
            ->getRepository(Home::class)
            ->getHomeDataByNombre(10) ;
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
                'imageFile' => str_replace("../public/", "/", $docFolder).$doc->getImage(),
                'imageName' => $doc->getImage(),
                'textContent' => !is_null($doc->getTextContent()) ? $doc->getTextContent() : ''
            ];
        }
  
        return $this->json(array("data"=>$data, "posttypes"=>$listPosttypes));
    }

    /**
     * @Route("/home_fo/{id}", name="home_fo_detail", methods={"GET"})
     */
    public function details(int $id, ManagerRegistry $doctrine): Response
    {
        $data = [];
        $docFolder = '../public/files/home/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
        $homeData = $doctrine->getManager()
            ->getRepository(Home::class)
            ->find($id);
        $data = [
            'id' => $homeData->getId(),
            'title' => $homeData->getTitle(),
            'imageFile' => str_replace("../public/", "/", $docFolder).$homeData->getImage(),
            'imageName' => $homeData->getImage(),
            'textContent' => !is_null($homeData->getTextContent()) ? $homeData->getTextContent() : ''
        ];
  
        return $this->json($data);
    }
}