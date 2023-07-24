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
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class EventController extends AbstractController
{
    /**
     * @Route("/events", name="event_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $events = $doctrine->getManager()
                ->getRepository(Event::class)
                ->findAll();      
            foreach ($events as $event) {
                $data[] = [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'begin' => $event->getBegin()->format('d/m/Y H:i'),
                    'end' => $event->getEnd()->format('d/m/Y H:i'),
                    'short_description' => $event->getShortDescription(),
                    'long_description' => $event->getLongDescription()
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/events/create", name="event_new", methods={"POST"})
     */
    public function new(Request $request, EventRepository $eventRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $event = new Event();
                $event->setTitle($request->request->get('title'));
                $event->setBegin(new \DateTime($request->request->get('begin')));
                $event->setEnd(new \DateTime($request->request->get('end')));
                $event->setShortDescription($request->request->get('short_description'));
                $event->setLongDescription($request->request->get('long_description'));
                $eventRepository->add($event, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/events/{id}", name="event_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $event = $doctrine->getManager()
                ->getRepository(Event::class)
                ->find($id);
            if (!$event) {
                return $this->json('Evènement introuvable : id #' . $id, 404);
            }
            $data = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'begin' => $event->getBegin()->format('Y-m-d H:i:s'),
                'end' => $event->getEnd()->format('Y-m-d H:i:s'),
                'short_description' => $event->getShortDescription(),
                'long_description' => $event->getLongDescription()
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/events/edit/{id}", name="event_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $event = $entityManager->getRepository(Event::class)->find($id);
  
        if (!$event) {
            return $this->json('Evènement introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $event->setTitle($request->request->get('title'));
                $event->setBegin(new \DateTime($request->request->get('begin')));
                $event->setEnd(new \DateTime($request->request->get('end')));
                $event->setShortDescription($request->request->get('short_description'));
                $event->setLongDescription($request->request->get('long_description'));
                $entityManager->persist($event);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/events/remove/{id}", name="event_delete", methods={"DELETE"})
     */
    public function delete(int $id, Event $event, EventRepository $eventRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $eventRepository->remove($event, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}