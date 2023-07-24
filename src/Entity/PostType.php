<?php

namespace App\Entity;

use App\Repository\PostTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PostTypeRepository::class)
 */
class PostType
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
    private $designation;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\OneToMany(targetEntity=DocumentaryResources::class, mappedBy="PostType")
     */
    private $documentaryResources;

    public function __construct()
    {
        $this->documentaryResources = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDesignation(): ?string
    {
        return $this->designation;
    }

    public function setDesignation(string $designation): self
    {
        $this->designation = $designation;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, DocumentaryResources>
     */
    public function getDocumentaryResources(): Collection
    {
        return $this->documentaryResources;
    }

    public function addDocumentaryResource(DocumentaryResources $documentaryResource): self
    {
        if (!$this->documentaryResources->contains($documentaryResource)) {
            $this->documentaryResources[] = $documentaryResource;
            $documentaryResource->setPostType($this);
        }

        return $this;
    }

    public function removeDocumentaryResource(DocumentaryResources $documentaryResource): self
    {
        if ($this->documentaryResources->removeElement($documentaryResource)) {
            // set the owning side to null (unless already changed)
            if ($documentaryResource->getPostType() === $this) {
                $documentaryResource->setPostType(null);
            }
        }

        return $this;
    }
}
