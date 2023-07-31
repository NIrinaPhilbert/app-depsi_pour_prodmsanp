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
class DocumentaryResourcesController extends AbstractController
{
    /**
     * @Route("/docs", name="documentary_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $docFolder = '../public/files/documentary/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            $docs = $doctrine->getManager()
                ->getRepository(DocumentaryResources::class)
                ->findAll();      
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
                    'date' => $doc->getDate()->format('d/m/Y'),
                    'author' => $doc->getAuthor(),
                    'pub_type' => $doc->getPostType()->getDesignation(),
                    'direction' => $doc->getDirection()->getNom(),
                    'entities' => $doc->getEntities()->getName(),
                    'thematic' => $doc->getThemes()->getDesignation(),
                    'documentAccess' => $doc->getDocumentAccess()
                ];
            }
        }
  
        return $this->json($data);
    }

    /**
     * @Route("/docs/create", name="documentary_new", methods={"POST"})
     */
    public function new(Request $request, DocumentaryResourcesRepository $documentaryResourcesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $entityManager = $doctrine->getManager();
                $doc = new DocumentaryResources();
                $doc->setTitle($request->request->get('title'));
                $doc->setSummary($request->request->get('summary'));
                $doc->setDate(new \DateTime($request->request->get('date')));
                $doc->setAuthor($request->request->get('author'));
                //$doc->setPubType($request->request->get('pub_type'));
                $doc->setPostType($doctrine->getRepository(PostType::class)->find($request->request->get('pub_type')));
                $doc->setDirection($doctrine->getRepository(Direction::class)->find($request->request->get('direction')));
                $doc->setEntities($doctrine->getRepository(Entities::class)->find($request->request->get('entitys')));
                //$doc->setThematic($request->request->get('thematic'));
                $doc->setThemes($doctrine->getRepository(Themes::class)->find($request->request->get('thematic')));
                $doc->setDocumentAccess($request->request->get('documentAccess'));
                $documentaryResourcesRepository->add($doc, true);

                $newDoc = $doctrine->getRepository(DocumentaryResources::class)->findOneBy(array(), array('id'=>'DESC'));
                $docFolder = '../public/files/documentary/';
                if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
                $coverFile = $request->files->get('coverFile');
                $coverName = $request->request->get('coverName');
                $coverExtension = explode(".", $coverName)[(count(explode(".", $coverName)))-1];
                $coverFileName = "COVER-".md5($newDoc->getId()).".".$coverExtension;
                $coverFile->move($docFolder, $coverFileName);
                $newDoc->setCover($coverFileName);

                $docFiles = $request->files->all()['docFiles'];
                $documentNames = array();
                foreach ($docFiles as $keyDoc => $docFile) {
                    if (!is_null($docFile)) {
                        $docExtension = explode(".", $docFile->getClientOriginalName())[(count(explode(".", $docFile->getClientOriginalName())))-1];
                        $docFileName = str_replace(" ", "-", str_replace(".".$docExtension, "", $docFile->getClientOriginalName()))."-".date('YmdHis').".".$docExtension;
                        $docFile->move($docFolder, $docFileName);
                        $documentNames[] = $docFileName;
                    }
                }
                $newDoc->setDocument(json_encode($documentNames));

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
     * @Route("/docs/{id}", name="documentary_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();
        
        $data = [];
        if ($stateAuth['success']) {
            $docFolder = '../public/files/documentary/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            $doc = $doctrine->getManager()
                ->getRepository(DocumentaryResources::class)
                ->find($id);
            if (!$doc) {
                return $this->json('Ressource introuvable : id #' . $id, 404);
            }
            $directionOptions = array();
            $directions = $doctrine->getManager()
                ->getRepository(Direction::class)
                ->findAll();
            foreach ($directions as $keyDir => $direction) {
                $directionOptions[] = (object) [
                    'labelKey' => $direction->getId(),
                    'value' => $direction->getNom(),
                    'isSelected' => ($direction->getId() == $doc->getDirection()->getId()) ? true : false
                ];
            }

            $posttypeOptions = array();
            $posttypes = $doctrine->getManager()
                ->getRepository(PostType::class)
                ->findAll();
            foreach ($posttypes as $keyDir => $posttype) {
                $posttypeOptions[] = (object) [
                    'labelKey' => $posttype->getId(),
                    'value' => $posttype->getDesignation(),
                    'isSelected' => ($posttype->getId() == $doc->getPostType()->getId()) ? true : false
                ];
            }

            $themesOptions = array();
            $themes = $doctrine->getManager()
                ->getRepository(Themes::class)
                ->findAll();
            foreach ($themes as $keyDir => $theme) {
                $themesOptions[] = (object) [
                    'labelKey' => $theme->getId(),
                    'value' => $theme->getDesignation(),
                    'isSelected' => ($theme->getId() == $doc->getThemes()->getId()) ? true : false
                ];
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
                'coverFile' => !is_null($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                'coverName' => !is_null($doc->getCover()) ? $doc->getCover() : '',
                'docIcons' => $docIcons,
                'docFiles' => $docFiles,
                'docNames' => !empty($docNames) ? $docNames : '',
                'docSizes' => $docSizes,
                'date' => $doc->getDate()->format('Y-m-d'),
                'author' => $doc->getAuthor(),
                'pub_type' => $doc->getPostType()->getDesignation(),
                'posttypeOptions' => $posttypeOptions,
                'direction' => $doc->getDirection(),
                'directionOptions' => $directionOptions,
                'entities' => $doc->getEntities(),
                'thematic' => $doc->getThemes()->getDesignation(),
                'themesOptions' => $themesOptions,
                'documentAccess' => $doc->getDocumentAccess(),
                'summary' => $doc->getSummary(),
                'documentAccessOptions' => $documentAccessOptions
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/docs/edit/{id}", name="documentary_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $entityManager = $doctrine->getManager();
        $doc = $entityManager->getRepository(DocumentaryResources::class)->find($id);
  
        if (!$doc) {
            return $this->json('Ressource introuvable : id #' . $id, 404);
        }
         
        $data = array();
        if ($stateAuth['success']) {
            $docFolder = '../public/files/documentary/';
            if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $doc->setTitle($request->request->get('title'));
                $doc->setSummary($request->request->get('summary'));
                $doc->setDate(new \DateTime($request->request->get('date')));
                $doc->setAuthor($request->request->get('author'));
                //$doc->setPubType($request->request->get('pub_type'));
                $doc->setPostType($doctrine->getRepository(PostType::class)->find($request->request->get('pub_type')));
                $doc->setDirection($doctrine->getRepository(Direction::class)->find($request->request->get('direction')));
                $doc->setEntities($doctrine->getRepository(Entities::class)->find($request->request->get('entitys')));
                //$doc->setThematic($request->request->get('thematic'));
                $doc->setThemes($doctrine->getRepository(Themes::class)->find($request->request->get('thematic')));
                $doc->setDocumentAccess($request->request->get('documentAccess'));

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

                $documentNames = array();
                
                ///$docFiles = array();
                if(!empty($request->files->all()) && isset($request->files->all()['docFiles']))
                { 
                    $docFiles = $request->files->all()['docFiles'];           
                    $docNames = $request->request->get('docNames');
                    $docNamesToEdit = $request->request->get('docNamesToEdit');
                    foreach ($docNamesToEdit as $keyToEdit => $valueEdit) {
                        if (!in_array($valueEdit, $docNames)) {
                            if (!empty($valueEdit) && file_exists($docFolder.$valueEdit)) unlink($docFolder.$valueEdit);
                        } else $documentNames[] = $valueEdit;
                    }
                
                    foreach ($docFiles as $keyDoc => $docFile) {
                        if (!is_null($docFile)) {
                            $docExtension = explode(".", $docFile->getClientOriginalName())[(count(explode(".", $docFile->getClientOriginalName())))-1];
                            $docFileName = $docFileName = str_replace(" ", "-", str_replace(".".$docExtension, "", $docFile->getClientOriginalName()))."-".date('YmdHis').".".$docExtension;
                            $docFile->move($docFolder, $docFileName);
                            $documentNames[] = $docFileName;
                        }
                    }
                
                    /*if ($docName != $docNameToEdit) {
                        $docFile = $request->files->get('docFile');
                        $docExtension = explode(".", $docName)[(count(explode(".", $docName)))-1];
                        $docFileName = "DOC-".md5($doc->getId()).".".$docExtension;
                        if (!empty($docNameToEdit) && file_exists($docFolder.$docNameToEdit)) unlink($docFolder.$docNameToEdit);
                        $docFile->move($docFolder, $docFileName);
                        $doc->setDocument($docFileName);
                    }*/
                    $doc->setDocument(json_encode($documentNames));
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
     * @Route("/docs/remove/{id}", name="documentary_delete", methods={"DELETE"})
     */
    public function delete(int $id, DocumentaryResources $documentaryResources, DocumentaryResourcesRepository $documentaryResourcesRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $doc = $documentaryResourcesRepository->find($id);
        $documentaryResourcesRepository->remove($documentaryResources, true);
        $coverToDelete = '../public/files/documentary/'.$doc->getCover();
        if (file_exists($coverToDelete)) unlink($coverToDelete);
        if (!is_null($doc->getDocument())) {
            $files = json_decode($doc->getDocument());
            foreach ($files as $key => $value) {
                if (file_exists('../public/files/documentary/'.$value)) {
                    $docToDelete = '../public/files/documentary/'.$value;
                    if (file_exists($docToDelete)) unlink($docToDelete);
                }
            }
        }
        $data = array('success'=>true);
  
        return $this->json($data);
    }
  
}