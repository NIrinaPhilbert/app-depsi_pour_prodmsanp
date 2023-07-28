<?php

namespace App\Repository;

use App\Entity\Organigrammedepsi;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Organigrammedepsi>
 *
 * @method Organigrammedepsi|null find($id, $lockMode = null, $lockVersion = null)
 * @method Organigrammedepsi|null findOneBy(array $criteria, array $orderBy = null)
 * @method Organigrammedepsi[]    findAll()
 * @method Organigrammedepsi[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrganigrammedepsiRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Organigrammedepsi::class);
    }

    public function add(Organigrammedepsi $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Organigrammedepsi $entity, bool $flush = false): void
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
//     * @return Organigrammedepsi[] Returns an array of Organigrammedepsi objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Organigrammedepsi
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
