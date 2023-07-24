<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Visitor;
use App\Repository\VisitorRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class VisitorController extends AbstractController
{
    /**
     * @Route("/visitors", name="visitor_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $visitors = $doctrine->getManager()
                ->getRepository(Visitor::class)
                ->findAll();      
            foreach ($visitors as $visitor) {
                $data[] = [
                    'id' => $visitor->getId(),
                    'infos' => $visitor->getInfos(),
                    'date' => $visitor->getCreatedAt()->format('d/m/Y H:i:s')
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/visitors/total", name="visitor_total", methods={"GET"})
     */
    public function total(ManagerRegistry $doctrine, ParameterBagInterface $params): Response
    {
        
        $visitors = $doctrine->getManager()
            ->getRepository(Visitor::class)
            ->findAll();      
        $data = count($visitors);
  
        return $this->json($data);
    }
  
}