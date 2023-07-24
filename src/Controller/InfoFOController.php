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
  
/**
 * @Route("/api", name="api_")
 */
class InfoFOController extends AbstractController
{
    /**
     * @Route("/infos_fo/{page}", name="info_fo_index", methods={"POST"})
     */
    public function index(int $page, Request $request, InfoRepository $infoRepository, ManagerRegistry $doctrine): Response
    {
        $nombreItems = 5;
        $offset = ($page-1)*$nombreItems;
        $data['infos'] = [];
        if ($request->request->has('action') && $request->request->get('action') == 'search') {
            $searchData = $request->request->get('search');
            $searchData = !is_null($searchData) ? json_decode($searchData) : null;
            $infos = $infoRepository->getDataByPage($offset, $nombreItems, $searchData);
            foreach ($infos as $key => $info) {
                $textContent = $key == 0 ? $info->getTextContent() : '';
                $data['infos'][] = [
                    'id' => $info->getId(),
                    'title' => $info->getTitle(),
                    'textContent' => $textContent,
                    'majAt' => $info->getMajAt()->format('d/m/Y')
                ];
            }
            $all_infos = $infoRepository->getDataByPage(null, null, $searchData);
            $data['pagination']['total'] = (count($all_infos) <= $nombreItems) ? 1 : round(count($all_infos)/$nombreItems);
            $data['pagination']['current'] = $page;

            return $this->json($data);
        } else return $this->json([]);
    }

    /**
     * @Route("/infos_fo/show/{id}", name="info_fo_show", methods={"GET"})
     */
    public function show(int $id, InfoRepository $infoRepository, ManagerRegistry $doctrine): Response
    {
        
        $data = [];
        $info = $doctrine->getManager()
            ->getRepository(Info::class)
            ->find($id);
  
        if (!$info) {
            return $this->json('Information introuvable : id #' . $id, 404);
        }

        $data =  [
            'textContent' => $info->getTextContent()
        ];

        return $this->json($data);
    }
}