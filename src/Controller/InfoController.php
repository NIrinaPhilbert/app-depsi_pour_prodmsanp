<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Info;
use App\Repository\InfoRepository;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class InfoController extends AbstractController
{
    /**
     * @Route("/infos", name="info_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $infos = $doctrine->getManager()
                ->getRepository(Info::class)
                ->findAll();      
            foreach ($infos as $info) {
                $data[] = [
                    'id' => $info->getId(),
                    'title' => $info->getTitle(),
                    'infoaccess' => $info->getInfoAccess(),
                    'textContent' => $info->getTextContent(),
                    'majAt' => $info->getMajAt()->format('d/m/Y H:i')
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/infos/create", name="info_new", methods={"POST"})
     */
    public function new(Request $request, InfoRepository $infoRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $info = new Info();
                $info->setTitle($request->request->get('title'));
                $info->setTextContent($request->request->get('textContent'));
                $info->setInfoAccess($request->request->get('infoaccess'));
                $info->setMajAt(new \DateTime(date('Y-m-d H:i:s')));
                $infoRepository->add($info, true);

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/infos/{id}", name="info_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $info = $doctrine->getManager()
                ->getRepository(Info::class)
                ->find($id);
            if (!$info) {
                return $this->json('Info introuvable : id #' . $id, 404);
            }

            
            $documentAccessOptions = array();
            $document_access_keys = explode('|', $_ENV['DOCUMENT_ACCESS_KEYS']);
            $document_access_values = explode('|', $_ENV['DOCUMENT_ACCESS_VALUES']);
            foreach ($document_access_keys as $keyAccess => $valueAccessKey) {
                $documentAccessOptions[] = (object) [
                    'labelKey' => $document_access_keys[$keyAccess],
                    'value' => $document_access_values[$keyAccess],
                    'isSelected' => ($valueAccessKey == $info->getInfoAccess()) ? true : false
                ];
            }

            $data = [
                'id' => $info->getId(),
                'title' => $info->getTitle(),
                'textContent' => $info->getTextContent(),
                'documentAccess' => $info->getInfoAccess(),
                'documentAccessOptions' => $documentAccessOptions,
                'majAt' => $info->getMajAt()->format('d/m/Y H:i')
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/infos/edit/{id}", name="info_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $info = $entityManager->getRepository(Info::class)->find($id);
  
        if (!$info) {
            return $this->json('Info introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $info->setTitle($request->request->get('title'));
                $info->setTextContent($request->request->get('textContent'));
                $info->setInfoAccess($request->request->get('infoaccess'));
                $info->setMajAt(new \DateTime(date('Y-m-d H:i:s')));
                $entityManager->persist($info);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/infos/remove/{id}", name="info_delete", methods={"DELETE"})
     */
    public function delete(int $id, Info $info, InfoRepository $infoRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $infoRepository->remove($info, true);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}