<?php

namespace App\Entity;

use App\Repository\OrganigrammedepsiRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=OrganigrammedepsiRepository::class)
 */
class Organigrammedepsi
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
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

    public function setTextContent(string $text_content): self
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
