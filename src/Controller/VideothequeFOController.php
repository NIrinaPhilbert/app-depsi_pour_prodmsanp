<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\VideoTheque;
use App\Repository\VideoThequeRepository;
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class VideothequeFOController extends AbstractController
{
    /**
     * @Route("/videotheques_fo/{page}", name="videotheque_fo_index", methods={"GET"})
     */
    public function index(int $page, VideoThequeRepository $videoThequeRepository, ManagerRegistry $doctrine): Response
    {
        $nombreItems = 10;
        $offset = ($page-1)*$nombreItems;
        $data['videos'] = [];
        $videos = $videoThequeRepository->getDataByPage($offset, $nombreItems);
        $videoFolder = '../public/files/videotheque/';
        foreach ($videos as $video) {
            $data['videos'][] = [
                'id' => $video->getId(),
                'title' => $video->getTitle(),
                'coverFile' => !is_null($video->getCover()) ? str_replace("../public/", "/", $videoFolder).$video->getCover() : '',
                'coverName' => !is_null($video->getCover()) ? $video->getCover() : '',
            ];
        }
        $all_videos = $doctrine->getManager()
                ->getRepository(VideoTheque::class)
                ->findAll();
        $data['pagination']['total'] = (count($all_videos) <= $nombreItems) ? 1 : round(count($all_videos)/$nombreItems);
        $data['pagination']['current'] = $page;

        return $this->json($data);
    }

    /**
     * @Route("/videotheques_fo/show/{id}", name="videotheque_fo_show", methods={"GET"})
     */
    public function show(int $id, VideoThequeRepository $videoThequeRepository, ManagerRegistry $doctrine): Response
    {
        
        $data = [];
        $event = $doctrine->getManager()
            ->getRepository(VideoTheque::class)
            ->find($id);
  
        if (!$event) {
            return $this->json('Vidéothèque introuvable : id #' . $id, 404);
        }

        $data =  [
            'title' => $event->getTitle(),
            'video' => $event->getVideo()
        ];

        return $this->json($data);
    }
}