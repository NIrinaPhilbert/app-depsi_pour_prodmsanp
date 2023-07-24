<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\UserPlatform;
use App\Entity\User;
use App\Repository\UserPlatformRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use App\Service\StateService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
  
/**
 * @Route("/api", name="api_")
 */
class UserFOController extends AbstractController
{
    /**
     * @Route("/user_fo/list", name="user_fo_index", methods={"GET"})
     */
    public function index(ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = [];
        if ($stateAuth['success']) {
            $users = $doctrine->getManager()
                ->getRepository(UserPlatform::class)
                ->findAll();
            foreach ($users as $user) {
                $roles = (in_array("ROLE_ADMIN", $user->getEmail()->getRoles())) ? "Administrateur" : "Utilisateur";
                $data[] = [
                    'id' => $user->getId(),
                    'fullname' => $user->getFirstname().(!is_null($user->getLastname()) ? ' '.$user->getLastname() : ''),
                    'email' => $user->getEmail()->getEmail(),
                    'roles' => $roles,
                    'statut' => $user->getStatut(),
                ];
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/user_fo/create", name="user_fo_new", methods={"POST"})
     */
    public function new(Request $request, UserPlatformRepository $userPlatformRepository, ManagerRegistry $doctrine, Security $security, UserPasswordEncoderInterface $passwordEncoder, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            if ($request->request->has('action') && $request->request->get('action') == 'add') {
                $ifEmailExist = ($doctrine->getRepository(User::class)->findBy(array('email' => $request->request->get('email'))) == null) ? false : true;
                if($ifEmailExist) {
                    $data = array(
                        "success" => false,
                        "msg" => "Cet e-mail n'est plus disponible."
                    );
                } else {
                    $entityManager = $doctrine->getManager();
                    $user = new User();
                    $user->setEmail($request->request->get('email'));
                    $user->setPassword($passwordEncoder->encodePassword($user, $request->request->get('password')));
                    $roles = ($request->request->get('roles') == 'ROLE_ADMIN') ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"];
                    $user->setRoles($roles);
                    $user->setIsVerified(true);
                    $entityManager->persist($user);
                    $entityManager->flush();

                    $userPlatform = new UserPlatform();
                    $userPlatform->setEmail($user);
                    $userPlatform->setCreatedAt(new \DateTime(date('Y-m-d H:i:s')));
                    $userPlatform->setFirstname($request->request->get('firstname'));
                    $userPlatform->setLastname(!empty($request->request->get('lastname')) ? $request->request->get('lastname') : null);
                    $userPlatform->setPhone(!empty($request->request->get('phone')) ? $request->request->get('phone') : null);
                    $userPlatform->setAddress(!empty($request->request->get('address')) ? $request->request->get('address') : null);
                    $userPlatform->setStatut($request->request->get('statut'));
                    $userPlatformRepository->add($userPlatform, true);

                    $data = array(
                        "success" => true
                    );

                }
            }
        }

        return $this->json($data);
    }

    /**
     * @Route("/user_fo/{id}", name="user_fo_show", methods={"GET"})
     */
    public function show(int $id, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            $user = $doctrine->getManager()
                ->getRepository(UserPlatform::class)
                ->find($id);
      
            if (!$user) {
                return $this->json('Utilisateur introuvable : id #' . $id, 404);
            }
            $rolesOptions = array(
                (object) ['labelKey'=>'ROLE_ADMIN', 'value'=>'Administrateur', 'isSelected'=>true],
                (object) ['labelKey'=>'ROLE_USER', 'value'=>'Utilisateur', 'isSelected'=>false]
            );
            if (!in_array("ROLE_ADMIN", $user->getEmail()->getRoles())) {
                $rolesOptions = array(
                    (object) ['labelKey'=>'ROLE_ADMIN', 'value'=>'Administrateur', 'isSelected'=>false],
                    (object) ['labelKey'=>'ROLE_USER', 'value'=>'Utilisateur', 'isSelected'=>true]
                );
            }
            $statutOptions = array();
            $tUserStatus = explode('|', $_ENV['USER_STATUS']);
            foreach ($tUserStatus as $valueStatus) {
                $statutOptions[] = (object) [
                    'labelKey' => $valueStatus,
                    'value' => $valueStatus,
                    'isSelected' => ($valueStatus == $user->getStatut()) ? true : false
                ];
            }
            $roles = (in_array("ROLE_ADMIN", $user->getEmail()->getRoles())) ? "ROLE_ADMIN" : "ROLE_USER";

            $data =  [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => !is_null($user->getLastname()) ? $user->getLastname() : '',
                'address' => !is_null($user->getAddress()) ? $user->getAddress() : '',
                'phone' => !is_null($user->getPhone()) ? $user->getPhone() : '',
                'email' => $user->getEmail()->getEmail(),
                'rolesOptions' => $rolesOptions,
                'roles' => $roles,
                'statutOptions' => $statutOptions,
                'statut' => $user->getStatut(),
            ];
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/user_fo/edit/{id}", name="user_fo_edit", methods={"POST"})
     */
    public function edit(Request $request, int $id, ManagerRegistry $doctrine, Security $security, UserPasswordEncoderInterface $passwordEncoder, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
            $entityManager = $doctrine->getManager();
            $userPlatform = $entityManager->getRepository(UserPlatform::class)->find($id);
      
            if (!$userPlatform) {
                return $this->json('Utilisateur introuvable : id #' . $id, 404);
            }
             
            if ($request->request->has('action') && $request->request->get('action') == 'modify') {
                $dataEmail = $doctrine->getRepository(User::class)->findOneBy(array('email' => $request->request->get('email')));
                if($dataEmail !== null && $dataEmail->getEmail() != $request->request->get('emailToEdit')) {
                    $data = array(
                        "success" => false,
                        "msg" => "Cet e-mail n'est plus disponible."
                    );
                } else {
                    $user = $entityManager->getRepository(User::class)->findOneBy(array('id'=>$userPlatform->getEmail()->getId()));
                    $user->setEmail($request->request->get('email'));
                    if (!empty($request->request->get('password'))) {
                        $user->setPassword($passwordEncoder->encodePassword($user, $request->request->get('password')));
                    } else $user->setPassword($user->getPassword());
                    $roles = ($request->request->get('roles') == 'ROLE_ADMIN') ? ["ROLE_ADMIN", "ROLE_USER"] : ["ROLE_USER"];
                    $user->setRoles($roles);
                    $user->setIsVerified(true);
                    $entityManager->persist($user);
                    $entityManager->flush();

                    $userPlatform->setEmail($user);
                    $userPlatform->setCreatedAt($userPlatform->getCreatedAt());
                    $userPlatform->setEditedAt(new \DateTime(date('Y-m-d H:i:s')));
                    $userPlatform->setFirstname($request->request->get('firstname'));
                    $userPlatform->setLastname(!empty($request->request->get('lastname')) ? $request->request->get('lastname') : null);
                    $userPlatform->setPhone(!empty($request->request->get('phone')) ? $request->request->get('phone') : null);
                    $userPlatform->setAddress(!empty($request->request->get('address')) ? $request->request->get('address') : null);
                    $userPlatform->setStatut($request->request->get('statut'));
                    $entityManager->persist($userPlatform);
                    $entityManager->flush();

                    $data = array(
                        "success" => true
                    );

                }
            }
        }
          
        return $this->json($data);
    }

    /**
     * @Route("/user_fo/remove/{id}", name="user_fo_delete", methods={"DELETE"})
     */
    public function delete(int $id, UserPlatform $userPlatform, UserPlatformRepository $userPlatformRepository, ManagerRegistry $doctrine, Security $security, ParameterBagInterface $params): Response
    {
        $stateService = new StateService($security, $params);
        $stateAuth = $stateService->checkState();

        $data = array();
        if ($stateAuth['success']) {
        //if ($request->request->has('action') && $request->request->get('action') == 'delete') {
            $entityManager = $doctrine->getManager();
            $user = $entityManager->getRepository(User::class)->findOneBy(array('id'=>$userPlatform->getEmail()->getId()));
            $entityManager->remove($user);
            $entityManager->flush();
            $userPlatformRepository->remove($userPlatform, true);
            $data = array('success'=>true);
        //}
        }
  
        return $this->json($data);
    }
  
}