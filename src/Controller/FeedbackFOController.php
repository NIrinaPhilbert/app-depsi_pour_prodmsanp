<?php

namespace App\Controller;

use App\Entity\Feedback;
use App\Repository\FeedbackRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api", name="api_")
 */
class FeedbackFOController extends AbstractController
{
    /**
     * @Route("/feedback_fo/create", name="feedback_fo_new", methods={"POST"})
     */
    public function new(Request $request, FeedbackRepository $feedbackRepository): Response
    {
        $data = array();
        if ($request->request->has('action') && $request->request->get('action') == 'add') {
            $feedback = new Feedback();
            $feedback->setComment($request->request->get('comment'));
            $feedbackRepository->add($feedback, true);

            $data = array(
                "success" => true
            );
        }

        return $this->json($data);
    }
}
