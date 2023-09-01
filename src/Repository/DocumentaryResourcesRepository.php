<?php

namespace App\Repository;

use App\Entity\DocumentaryResources;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DocumentaryResources>
 *
 * @method DocumentaryResources|null find($id, $lockMode = null, $lockVersion = null)
 * @method DocumentaryResources|null findOneBy(array $criteria, array $orderBy = null)
 * @method DocumentaryResources[]    findAll()
 * @method DocumentaryResources[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DocumentaryResourcesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DocumentaryResources::class);
    }

    public function add(DocumentaryResources $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(DocumentaryResources $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getDataByNombre($nombre): array
   {
       return $this->createQueryBuilder('d')
           ->orderBy('d.id', 'DESC')
           ->setMaxResults($nombre)
           ->getQuery()
           ->getResult()
       ;
   }

    public function rrmdir($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
                }
            }
            reset($objects);
            rmdir($dir);
        }
    }

    /*public function getDynamicFileSize($filePath) {
        $bytes = filesize($filePath);
        $units = ['Ko', 'Mo', 'Go', 'To']; // Add more units as needed
        $base = 1024; // Bytes in a kilobyte

        if ($bytes <= 0) {
            return '0 ' . $units[0]; // Handle special case
        }

        $index = floor(log($bytes, $base));
        $size = round($bytes / pow($base, $index), 2);

        return $size . ' ' . $units[$index];
    }*/
    public function getDynamicFileSize($filePath) {
        $bytes = filesize($filePath);
        $units = array('B', 'KB', 'MB', 'GB');
        $unitIndex = 0;
        
        while ($bytes >= 1024 && $unitIndex < count($units) - 1) {
            $bytes /= 1024;
            $unitIndex++;
        }
        
        return round($bytes, 2) . ' ' . $units[$unitIndex];
    }
    // amelioration 07082023
    public function groupArrayPerNumber($data, $number) {
        $groupedData = [];
        $tempGroup = [];

        foreach ($data as $item) {
            $tempGroup[] = $item;

            if (count($tempGroup) === $number) {
                $groupedData[] = $tempGroup;
                $tempGroup = [];
            }
        }

        if (!empty($tempGroup)) {
            $groupedData[] = $tempGroup;
        }

        return $groupedData;
    }
    // /. amelioration 07082023

}
