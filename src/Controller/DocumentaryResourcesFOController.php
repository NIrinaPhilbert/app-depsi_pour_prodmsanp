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
use Symfony\Component\Security\Core\Security;
  
/**
 * @Route("/api", name="api_")
 */
class DocumentaryResourcesFOController extends AbstractController
{
    /**
     * @Route("/docs_fo/list", name="documentary_fo_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine): Response
    {
        $data = [];
        $docFolder = '../public/files/documentary/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
        $docs = $doctrine->getManager()
            ->getRepository(DocumentaryResources::class)
            ->findBy(array(), array('id' => 'DESC'));
            //->findAll();
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
                'date' => $doc->getDate()->format('d/m/Y'),
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
     * @Route("/docs_fo/latest", name="documentary_fo_latest", methods={"GET"})
     */
    public function latest(ManagerRegistry $doctrine): Response
    {
        $data = [];
        $docFolder = '../public/files/documentary/';
        if (!file_exists($docFolder)) mkdir($docFolder, 0777, true);
        $docs = $doctrine->getManager()
            ->getRepository(DocumentaryResources::class)
            ->getDataByNombre(10);
        foreach ($docs as $doc) {
            $data[] = [
                'id' => $doc->getId(),
                'title' => $doc->getTitle(),
                'imageFile' => !is_null($doc->getCover()) && !empty($doc->getCover()) ? str_replace("../public/", "/", $docFolder).$doc->getCover() : '',
                'imageName' => !is_null($doc->getCover()) && !empty($doc->getCover()) ? $doc->getCover() : '',
                'textContent' => ''
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