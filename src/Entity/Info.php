<?php

namespace App\Entity;

use App\Repository\InfoRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=InfoRepository::class)
 */
class Info
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
     * @ORM\Column(type="string", length=10, options={"default" : "public"})
     */
    private $info_access;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $text_content;

    /**
     * @ORM\Column(type="datetime")
     */
    private $maj_at;

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

    public function getTextContent(): ?string
    {
        return $this->text_content;
    }

    public function setTextContent(?string $text_content): self
    {
        $this->text_content = $text_content;

        return $this;
    }

    public function getMajAt(): ?\DateTimeInterface
    {
        return $this->maj_at;
    }

    public function setMajAt(\DateTimeInterface $maj_at): self
    {
        $this->maj_at = $maj_at;

        return $this;
    }

    public function getInfoAccess(): ?string
    {
        return $this->info_access;
    }

    public function setInfoAccess(string $info_access): self
    {
        $this->info_access = $info_access;

        return $this;
    }
}
