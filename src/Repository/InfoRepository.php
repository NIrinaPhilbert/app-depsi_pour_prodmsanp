<?php

namespace App\Repository;

use App\Entity\Info;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Info>
 *
 * @method Info|null find($id, $lockMode = null, $lockVersion = null)
 * @method Info|null findOneBy(array $criteria, array $orderBy = null)
 * @method Info[]    findAll()
 * @method Info[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InfoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Info::class);
    }

    public function add(Info $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Info $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getDataByPage($offset, $nombre, $search): array
    {
        $query = $this->createQueryBuilder('e');
        if (!is_null($search)) {
            if ($search->label == 'title' && !empty($search->text)) {
                // $query->where('e.title LIKE \'%'.$search->text.'%\'');
                $query->where($query->expr()->like(
                    $query->expr()->lower('e.title'),
                    $query->expr()->lower(':searchTitle')
                ))->setParameter('searchTitle', '%'.$search->text.'%', \PDO::PARAM_STR);
            }
        }
        if (!is_null($offset)) $query->setFirstResult($offset);
        if (!is_null($nombre)) $query->setMaxResults($nombre);
        if (!is_null($offset) && !is_null($nombre)) $query->orderBy('e.maj_at', 'DESC');
        // if ($search != null) dd($query->getQuery());
        $data = $query->getQuery()->getResult();
        return $data;
    }

//    /**
//     * @return Info[] Returns an array of Info objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Info
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
