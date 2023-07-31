<?php

namespace App\Entity;

use App\Repository\AboutRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=AboutRepository::class)
 */
class About
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $text_content;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTextContent(): ?string
    {
        return $this->text_content;
    }

    public function setTextContent(?string $text_content): self
    {
        $this->text_content = $text_content;

        return $this;
    }
    public function setId(int $id): self
    {
        $this->id = $id;

        return $this;
    }
}
