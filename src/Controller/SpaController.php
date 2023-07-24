<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
  
class SpaController extends AbstractController
{
    /**
     * @Route("/admin/{reactRouting}", name="app_home", requirements={"reactRouting"="^(?!api).+"}, defaults={"reactRouting": null})
     */
    public function index(Security $security)
    {
        if (null === $security->getUser()) {
            return $this->redirectToRoute('app_login', [], Response::HTTP_SEE_OTHER);
        }
        $data = array(
            'mail'=>$security->getUser()->getEmail(),
            'fname'=>$security->getUser()->retrieveUserPlatform()->getFirstname(),
            'lname'=>$security->getUser()->retrieveUserPlatform()->getLastname(),
            'access'=>(in_array("ROLE_ADMIN", $security->getUser()->getRoles())) ? "root" : "user"
        );
        return $this->render('spa/admin/index.html.twig', array('data' => $data));
    }

    /**
     * @Route("/{reactRouting}", name="app_fo_home", requirements={"reactRouting"="^(?!api).+"}, defaults={"reactRouting": null})
     */
    public function indexFo(Security $security)
    {
        if (null !== $security->getUser()) {
            $data = array(
                'mail'=>$security->getUser()->getEmail(),
                'fname'=>$security->getUser()->retrieveUserPlatform()->getFirstname(),
                'lname'=>$security->getUser()->retrieveUserPlatform()->getLastname(),
                'access'=>(in_array("ROLE_ADMIN", $security->getUser()->getRoles())) ? "root" : "user"
            );
        } else {
            $data = array('access'=>"none");
        }
        return $this->render('spa/fo/index.html.twig', array('data' => $data));
    }
}