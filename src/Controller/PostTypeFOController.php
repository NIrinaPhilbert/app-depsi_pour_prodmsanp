<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api", name="api_")
 */
class PostTypeFOController extends AbstractController
{
   
    /**
     * @Route("/posttypewiththeme", name="posttype_fo_withteme", methods={"GET"})
     */
    public function listPostTypeWithThematic(): Response
    {
        return $this->render('post_type_fo/index.html.twig', [
            'controller_name' => 'PostTypeFOController',
        ]);
    }
}
