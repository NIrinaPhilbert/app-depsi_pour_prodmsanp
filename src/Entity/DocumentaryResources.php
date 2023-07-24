<?php

namespace App\Entity;

use App\Repository\DocumentaryResourcesRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=DocumentaryResourcesRepository::class)
 */
class DocumentaryResources
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
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $author;

    

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $document;

    /**
     * @ORM\Column(type="string", length=10, options={"default" : "public"})
     */
    private $document_access;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cover;

    /**
     * @ORM\ManyToOne(targetEntity=Direction::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $direction;

    /**
     * @ORM\ManyToOne(targetEntity=Entities::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $entities;

    /**
     * @ORM\ManyToOne(targetEntity=PostType::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $posttype;

    /**
     * @ORM\ManyToOne(targetEntity=Themes::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $theme;

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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    

   

    

    public function getDocument(): ?string
    {
        return $this->document;
    }

    public function setDocument(?string $document): self
    {
        $this->document = $document;

        return $this;
    }

    public function getDocumentAccess(): ?string
    {
        return $this->document_access;
    }

    public function setDocumentAccess(string $document_access): self
    {
        $this->document_access = $document_access;

        return $this;
    }

    public function getCover(): ?string
    {
        return $this->cover;
    }

    public function setCover(string $cover): self
    {
        $this->cover = $cover;

        return $this;
    }

    public function getDirection(): ?Direction
    {
        return $this->direction;
    }

    public function setDirection(?Direction $direction): self
    {
        $this->direction = $direction;

        return $this;
    }

    public function getEntities(): ?Entities
    {
        return $this->entities;
    }

    public function setEntities(?Entities $entities): self
    {
        $this->entities = $entities;

        return $this;
    }

    public function getPostType(): ?PostType
    {
        return $this->posttype;
    }

    public function setPostType(?PostType $posttype): self
    {
        $this->posttype = $posttype;

        return $this;
    }

    public function getThemes(): ?Themes
    {
        return $this->theme;
    }
/*
    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;

        return $this;
    }
*/
    public function setThemes(?Themes $theme): self
    {
        $this->theme = $theme;

        return $this;
    }

}
