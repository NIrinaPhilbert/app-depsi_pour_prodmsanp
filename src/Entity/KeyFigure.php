<?php

namespace App\Entity;

use App\Repository\KeyFigureRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=KeyFigureRepository::class)
 */
class KeyFigure
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $data_axis;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $statut;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $koption;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $code_content;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDataAxis(): ?string
    {
        return $this->data_axis;
    }

    public function setDataAxis(?string $data_axis): self
    {
        $this->data_axis = $data_axis;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getKoption(): ?string
    {
        return $this->koption;
    }

    public function setKoption(string $koption): self
    {
        $this->koption = $koption;

        return $this;
    }

    public function getCodeContent(): ?string
    {
        return $this->code_content;
    }

    public function setCodeContent(?string $code_content): self
    {
        $this->code_content = $code_content;

        return $this;
    }
}
