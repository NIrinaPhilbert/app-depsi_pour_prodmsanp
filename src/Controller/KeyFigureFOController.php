<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\KeyFigure;
use App\Repository\KeyFigureRepository;
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class KeyFigureFOController extends AbstractController
{
    /**
     * @Route("/figures_fo/list", name="key_figure_fo_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine): Response
    {
        $figurePerSlide = 2;
        $data['figures'] = [];
        $figures = $doctrine->getManager()
            ->getRepository(KeyFigure::class)
            ->findBy(['statut'=>'Actif'], ['id'=>'DESC']);      
        foreach ($figures as $figure) {
            $data['figures'][] = [
                'id' => $figure->getId(),
                'title' => $figure->getTitle(),
                'statut' => $figure->getStatut(),
                'axis' => $figure->getDataAxis(),
                'koption' => $figure->getKoption(),
                'codeContent' => $figure->getCodeContent(),
            ];
        }
        $data['figures'] = array_chunk($data['figures'], $figurePerSlide);

        return $this->json($data);
    }
  
}