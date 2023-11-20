<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\VideoTheque;
use App\Repository\VideoThequeRepository;
use App\Entity\Entities;
use App\Entity\Direction;
#========================#
use App\Entity\PostType;
use App\Entity\Themes;
#========================#
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class VideothequeController extends AbstractController
{
    /**
     * @Route("/videotheques", name="videotheques_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $docFolder = '../public/files/videotheque/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            $docs = $doctrine->getManager()
                ->getRepository(VideoTheque::class)
                ->findBy([], ['id' => 'DESC']);
            foreach ($docs as $doc) {
                $data[] = [
                    'id' => $doc->getId(),
                    'title' => $doc->getTitle(),
                    'coverFile' => !is_null($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                    'coverName' => !is_null($doc->getCover()) ? $doc->getCover() : '',
                    'video' => $doc->getVideo()
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/videotheques/create", name="videotheques_new", methods={"POST"})
     */
    public function new(Request $request, VideoThequeRepository $videoThequeRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $doc = new VideoTheque();
                $doc->setTitle($request->request->get('title'));
                $doc->setVideo($request->request->get('video'));
                $videoThequeRepository->add($doc, true);

                $newDoc = $doctrine->getRepository(VideoTheque::class)->findOneBy(array(), array('id'=>'DESC'));
                $docFolder = '../public/files/videotheque/';
                if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
                $coverFile = $request->files->get('coverFile');
                $coverName = $request->request->get('coverName');
                $coverExtension = explode(".", $coverName)[(count(explode(".", $coverName)))-1];
                $coverFileName = "COVER-".md5($newDoc->getId()).".".$coverExtension;
                $coverFile->move($docFolder, $coverFileName);
                $newDoc->setCover($coverFileName);

                $entityManager->persist($newDoc);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/videotheques/{id}", name="videotheques_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $docFolder = '../public/files/videotheque/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            $doc = $doctrine->getManager()
                ->getRepository(VideoTheque::class)
                ->find($id);
            if (!$doc) {
                return $this->json('Vidéothèque introuvable : id #' . $id, 404);
            }
            $data = [
                'id' => $doc->getId(),
                'title' => $doc->getTitle(),
                'coverFile' => !is_null($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                'coverName' => !is_null($doc->getCover()) ? $doc->getCover() : '',
                'video' => $doc->getVideo()
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/videotheques/edit/{id}", name="videotheques_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $doc = $entityManager->getRepository(VideoTheque::class)->find($id);
  
        if (!$doc) {
            return $this->json('Vidéothèque introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            $docFolder = '../public/files/videotheque/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $doc->setTitle($request->request->get('title'));
                $doc->setVideo($request->request->get('video'));

                $coverName = $request->request->get('coverName');
                $coverNameToEdit = $request->request->get('coverNameToEdit');
                if ($coverName != $coverNameToEdit) {
                    $coverFile = $request->files->get('coverFile');
                    $coverExtension = explode(".", $coverName)[(count(explode(".", $coverName)))-1];
                    $coverFileName = "COVER-".md5($doc->getId()).".".$coverExtension;
                    if (!empty($coverNameToEdit) && file_exists($docFolder.$coverNameToEdit)) unlink($docFolder.$coverNameToEdit);
                    $coverFile->move($docFolder, $coverFileName);
                    $doc->setCover($coverFileName);
                }
                $entityManager->persist($doc);
                $entityManager->flush();

                $data = array(
                    "success" => true
                );
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/videotheques/remove/{id}", name="videotheques_delete", methods={"DELETE"})
     */
    public function delete(int $id, VideoTheque $videoTheque, VideoThequeRepository $videoThequeRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $doc = $videoThequeRepository->find($id);
        $videoThequeRepository->remove($videoTheque, true);
        $coverToDelete = '../public/files/videotheque/'.$doc->getCover();
        if (file_exists($coverToDelete)) unlink($coverToDelete);
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}