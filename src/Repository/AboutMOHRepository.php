<?php

namespace App\Repository;

use App\Entity\AboutMOH;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AboutMOH>
 *
 * @method AboutMOH|null find($id, $lockMode = null, $lockVersion = null)
 * @method AboutMOH|null findOneBy(array $criteria, array $orderBy = null)
 * @method AboutMOH[]    findAll()
 * @method AboutMOH[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AboutMOHRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AboutMOH::class);
    }

    public function add(AboutMOH $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AboutMOH $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function findDataByCount($nombre): array
   {
       return $this->createQueryBuilder('a')
           ->orderBy('a.id', 'ASC')
           ->setMaxResults($nombre)
           ->getQuery()
           ->getResult()
       ;
   }

//    /**
//     * @return AboutMOH[] Returns an array of AboutMOH objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AboutMOH
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
