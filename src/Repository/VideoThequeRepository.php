<?php

namespace App\Repository;

use App\Entity\VideoTheque;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VideoTheque>
 *
 * @method VideoTheque|null find($id, $lockMode = null, $lockVersion = null)
 * @method VideoTheque|null findOneBy(array $criteria, array $orderBy = null)
 * @method VideoTheque[]    findAll()
 * @method VideoTheque[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VideoThequeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VideoTheque::class);
    }

    public function add(VideoTheque $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VideoTheque $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getDataByPage($offset, $nombre): array
    {
        return $this->createQueryBuilder('e')
            ->orderBy('e.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($nombre)
            ->getQuery()
            ->getResult()
        ;
    }

//    /**
//     * @return VideoTheque[] Returns an array of VideoTheque objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('v.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?VideoTheque
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
