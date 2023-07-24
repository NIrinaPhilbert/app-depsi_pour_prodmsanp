<?php

namespace App\Entity;

use App\Repository\ThemesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ThemesRepository::class)
 */
class Themes
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
     * @ORM\ManyToOne(targetEntity=PostType::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $posttype;

    /**
     * @ORM\OneToMany(targetEntity=DocumentaryResources::class, mappedBy="ManyToOne")
     */
    private $no;

    public function __construct()
    {
        $this->no = new ArrayCollection();
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

    public function getPosttype(): ?PostType
    {
        return $this->posttype;
    }

    public function setPosttype(?PostType $posttype): self
    {
        $this->posttype = $posttype;

        return $this;
    }

    /**
     * @return Collection<int, DocumentaryResources>
     */
    public function getNo(): Collection
    {
        return $this->no;
    }

    public function addNo(DocumentaryResources $no): self
    {
        if (!$this->no->contains($no)) {
            $this->no[] = $no;
            $no->setManyToOne($this);
        }

        return $this;
    }

    public function removeNo(DocumentaryResources $no): self
    {
        if ($this->no->removeElement($no)) {
            // set the owning side to null (unless already changed)
            if ($no->getManyToOne() === $this) {
                $no->setManyToOne(null);
            }
        }

        return $this;
    }
}
