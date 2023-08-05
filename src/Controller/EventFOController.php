<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Event;
use App\Repository\EventRepository;
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class EventFOController extends AbstractController
{
    /**
     * @Route("/events_fo/{page}", name="event_fo_index", methods={"GET"})
     */
    public function index(int $page, EventRepository $eventRepository, ManagerRegistry $doctrine): Response
    {
        $nombreItems = 10;
        $offset = ($page-1)*$nombreItems;
        $data['events'] = [];
        $events = $eventRepository->getDataByPage($offset, $nombreItems);
        foreach ($events as $event) {
            $data['events'][] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'begin' => $event->getBegin()->format('d/m/Y H:i'),
                'end' => $event->getEnd()->format('d/m/Y H:i'),
                'short_description' => $event->getShortDescription()
            ];
        }
        $all_events = $doctrine->getManager()
                ->getRepository(Event::class)
                ->findAll();
        $data['pagination']['total'] = (count($all_events) <= $nombreItems) ? 1 : round(count($all_events)/$nombreItems);
        $data['pagination']['current'] = $page;

        return $this->json($data);
    }

    /**
     * @Route("/events_fo/show/{id}", name="event_fo_show", methods={"GET"})
     */
    public function show(int $id, EventRepository $eventRepository, ManagerRegistry $doctrine): Response
    {
        
        $data = [];
        $event = $doctrine->getManager()
            ->getRepository(Event::class)
            ->find($id);
  
        if (!$event) {
            return $this->json('Evènement introuvable : id #' . $id, 404);
        }

        $data =  [
            'courte_description' => $event->getShortDescription(),
            'long_description' => $event->getLongDescription(),
            'titreevenement' => $event->getTitle()
        ];

        return $this->json($data);
    }
}