-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  jeu. 24 août 2023 à 09:28
-- Version du serveur :  10.4.11-MariaDB
-- Version de PHP :  7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `db_recup`
--

-- --------------------------------------------------------

--
-- Structure de la table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `text_content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `about`
--

INSERT INTO `about` (`id`, `text_content`) VALUES
(5, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `about_moh`
--

CREATE TABLE `about_moh` (
  `id` int(11) NOT NULL,
  `text_content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `about_moh`
--

INSERT INTO `about_moh` (`id`, `text_content`) VALUES
(3, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `direction`
--

CREATE TABLE `direction` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `direction`
--

INSERT INTO `direction` (`id`, `nom`) VALUES
(1, 'DEPSI'),
(3, 'DVSSER');

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20220919095951', '2022-09-19 12:00:42', 3655),
('DoctrineMigrations\\Version20221025123945', '2022-10-25 14:40:33', 629),
('DoctrineMigrations\\Version20221026070852', '2022-10-26 09:09:19', 459),
('DoctrineMigrations\\Version20221027112024', '2022-10-27 13:20:59', 485),
('DoctrineMigrations\\Version20230218172655', '2023-02-18 18:28:55', 4149);

-- --------------------------------------------------------

--
-- Structure de la table `documentary_resources`
--

CREATE TABLE `documentary_resources` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_access` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direction_id` int(11) NOT NULL,
  `entities_id` int(11) NOT NULL,
  `posttype_id` int(11) NOT NULL,
  `theme_id` int(11) NOT NULL,
  `summary` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_document_strategic` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `documentary_resources`
--

INSERT INTO `documentary_resources` (`id`, `title`, `date`, `author`, `document`, `document_access`, `cover`, `direction_id`, `entities_id`, `posttype_id`, `theme_id`, `summary`, `is_document_strategic`) VALUES
(26, 'Bulletin SIS S1 2020', '2023-07-31', 'NA', '[\"DEPSI_SSSD_Bulletin_S1-2020-20230731135233.pdf\"]', 'public', 'COVER-4e732ced3463d06de0ca9a15b6153677.png', 1, 2, 1, 5, '<p><strong>Document permettant d&rsquo;informer semonstriellement tous les acteurs</strong> dans le domaine de la San-t&eacute; par rapport au syst&egrave;me d&rsquo;information sanitaire de routine &agrave; Madagascar. Objet de ce bulletin : pr&eacute;sentation du r&eacute;sum&eacute; de l&rsquo;&eacute;volution de la situation du COVID-19 &agrave; Madagascar de Mars &agrave; Juin 2020, des principaux indicateurs par programme de sant&eacute;, des activit&eacute;s phares r&eacute;alis&eacute;es par le MSANP dans le domaine du SIS et des &laquo; succ&egrave;s stories &raquo; relat&eacute;es par les projets IMPACT et SHOP PLUS au cours du 1er semestre de l&rsquo;ann&eacute;e 2020.</p>', 0),
(27, 'Bulletin S2 2021', '2022-06-30', 'NA', '[\"DEPSI_SSSD_Bulletin_S2-2021-20230731135915.pdf\"]', 'public', 'COVER-02e74f10e0327ad868d138f2b4fdd6f0.png', 1, 2, 1, 5, 'Document permettant d’informer semestriellement tous les acteurs dans le doumapub de la Santé par rapport au système d’information sanitaire de routine à Madagascar.  Objet de ce bulletin : Présentation des principaux indicateurs par programme de santé et les principales activités réalisées par le ministère : Directions, la DEPSI, quelques établissements publics à caractère administratif (EPA) et les PTFs au cours du 1er semestre de l’année 2022 ; ainsi qu’un aperçu sur la situation du COVID-19 et de la peste à Madagascar durant la même période.', 0),
(28, 'Bulletin SIS 1', '2023-07-05', 'NA', '[\"DEPSI_SSSD_Bulletin_S1-2021_insert-ok-20230804231321.pdf\"]', 'public', 'COVER-33e75ff09dd601bbe69f351039152189.png', 1, 2, 2, 2, '<p>col-sm-6 is a class i<strong>n Bootstrap</strong>, a popular front-end web development framework. It\'s used to define the width of a column in a grid system for sma</p>', 0);

-- --------------------------------------------------------

--
-- Structure de la table `entities`
--

CREATE TABLE `entities` (
  `id` int(11) NOT NULL,
  `direction_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `entities`
--

INSERT INTO `entities` (`id`, `direction_id`, `name`, `description`, `created_at`) VALUES
(2, 1, 'DEPSI', 'DEPSI Chefferie', '2023-07-24 11:11:55'),
(3, 3, 'SURECa', '', '2023-07-24 11:15:51'),
(4, 1, 'SARGEC', '', '2023-07-24 11:12:35'),
(5, 1, 'SSEv', '', '2023-07-24 11:12:57'),
(6, 1, 'SPROs', '', '2023-07-24 11:13:25'),
(7, 1, 'SONC', '', '2023-07-24 11:14:23'),
(8, 1, 'SEMIDSI', '', '2023-07-24 11:14:38'),
(9, 1, 'SSSD', '', '2023-07-24 11:14:51'),
(10, 1, 'SSEMV', '', '2023-07-24 11:16:11'),
(11, 1, 'SVSF', '', '2023-07-24 11:16:32');

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `begin` datetime NOT NULL,
  `end` datetime NOT NULL,
  `short_description` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `long_description` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `feedback`
--

INSERT INTO `feedback` (`id`, `comment`) VALUES
(1, 'Mandeha poryy'),
(2, 'ao tsara'),
(3, 'eka'),
(4, 'test');

-- --------------------------------------------------------

--
-- Structure de la table `home`
--

CREATE TABLE `home` (
  `id` int(11) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text_content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `info`
--

CREATE TABLE `info` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text_content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maj_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `key_figure`
--

CREATE TABLE `key_figure` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_axis` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `koption` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_content` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `available_at` datetime NOT NULL,
  `delivered_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `organigrammedepsi`
--

CREATE TABLE `organigrammedepsi` (
  `id` int(11) NOT NULL,
  `text_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `organigrammedepsi`
--

INSERT INTO `organigrammedepsi` (`id`, `text_content`) VALUES
(4, '');

-- --------------------------------------------------------

--
-- Structure de la table `post_type`
--

CREATE TABLE `post_type` (
  `id` int(11) NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `post_type`
--

INSERT INTO `post_type` (`id`, `designation`, `description`) VALUES
(1, 'Manuel de procédure opérationnel standard', NULL),
(2, 'Manuel ou guide d\'utilisation', NULL),
(3, 'Curriculum de formation', NULL),
(4, 'Rapport', NULL),
(5, 'Annuaire statistique', NULL),
(7, 'Document politique', NULL),
(8, 'Document stratégique', NULL),
(9, 'Recherche', NULL),
(10, 'Feuille de route', NULL),
(12, 'OG', NULL),
(13, 'Bulletin', NULL),
(15, 'Textes Legislatifs et Reglementaires', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `themes`
--

CREATE TABLE `themes` (
  `id` int(11) NOT NULL,
  `posttype_id` int(11) NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `themes`
--

INSERT INTO `themes` (`id`, `posttype_id`, `designation`) VALUES
(2, 2, 'DHIS2 Programme'),
(4, 7, 'Politique Nationale de Recherche pour la Santé'),
(5, 1, 'DHIS2 PEV'),
(6, 13, 'SIMR'),
(7, 13, 'Surveillance MEV'),
(8, 2, 'DHIS2 RMA'),
(9, 2, 'DHIS2 Ressources (en cours)'),
(10, 2, 'RMAE'),
(11, 2, 'SYGMA'),
(12, 2, 'DHIS2 COVAX'),
(13, 2, 'PTA'),
(14, 2, 'e-PTA'),
(15, 2, 'COMMCARE'),
(16, 2, 'Guide de Revues Périodiques'),
(17, 2, 'Guide de Suivi-Evaluation'),
(18, 2, 'Guide de remplissage RMA'),
(19, 3, 'DHIS2 RMA'),
(20, 3, 'DHIS2 Ressources (en cours)'),
(21, 3, 'RMAE'),
(22, 3, 'SYGMA'),
(23, 3, 'DHIS2 COVAX'),
(24, 3, 'e-PTA'),
(25, 3, 'COMMCARE'),
(26, 3, 'DHIS2 Programme'),
(27, 4, 'Rapport annuel'),
(28, 4, 'Rapport supervision'),
(29, 4, 'Rapport atelier'),
(30, 4, 'Comptes Nationaux de Santé'),
(31, 8, 'PSRSIS'),
(32, 8, 'Santé digitale'),
(33, 8, 'Plan de Suivi-Evaluation du PDSS'),
(34, 8, 'Plan Stratégique pour le Développement de la Recherche en Santé'),
(35, 9, 'Evaluation SIS'),
(36, 9, 'Evaluation DHIS2'),
(37, 9, 'Thèse en santé'),
(38, 9, 'Mémoire en santé'),
(39, 9, 'Thèse en SIS'),
(40, 9, 'Mémoire en SIS'),
(41, 9, 'Grille d\'évaluation'),
(42, 10, 'Sécteur privé'),
(43, 12, 'Registre de consultation'),
(44, 12, 'Registre PF'),
(45, 12, 'Registre CPON'),
(46, 12, 'RUMEUR'),
(47, 12, 'RMA CSB'),
(48, 12, 'RMA CHRD'),
(49, 12, 'RMA COM'),
(50, 12, 'RMA CHU/CHRR/ES'),
(51, 12, 'Formulaire de supervision'),
(52, 10, 'Sécteur privé'),
(53, 5, 'Annuaire statistique'),
(55, 8, 'SIMR'),
(56, 1, 'DHIS2 Routine'),
(57, 12, 'Outils AQD'),
(58, 12, 'Autres-Programmes'),
(59, 4, 'RGPH'),
(60, 4, 'ENSOMD'),
(61, 4, 'EPM'),
(62, 4, 'EDS'),
(63, 4, 'MICS'),
(64, 4, 'Resultats'),
(65, 12, 'RMA'),
(66, 12, 'Fiche de PEC PCIMEc'),
(67, 12, 'Fiche de PEC Rage'),
(68, 12, 'Fiche de référence contre référence'),
(69, 12, 'PF'),
(70, 12, 'RACPon'),
(71, 12, 'RAGE'),
(72, 12, 'RCE'),
(73, 12, 'RCE CSB'),
(74, 12, 'RCPN'),
(75, 12, 'Registre COM'),
(76, 12, 'Registre Consultation Externe_Reference-CHRD'),
(77, 12, 'Registre Consultation Externe_Reference_CHRR'),
(78, 12, 'Registre d_Hospitalisation CHU_CHRR'),
(79, 12, 'Registre Hospitalistain CHRD'),
(80, 12, 'REGISTRE NUTRITION'),
(81, 12, 'RSNE'),
(82, 12, 'SIMR'),
(83, 15, 'Arrêté'),
(84, 15, 'Loi'),
(85, 15, 'Decret'),
(86, 15, 'Convention internationale'),
(87, 13, 'Polio'),
(88, 13, 'SITREP'),
(89, 8, 'IEM'),
(90, 8, 'Plan Directeur  Maladies Tropicales Negligées (PDMTN) '),
(91, 8, 'Plan de Développement Secteur Santé (PDSS)'),
(92, 8, 'Politique Generale de l\'Etat (PGE)'),
(95, 8, 'Plan national de développement (PND)'),
(98, 8, 'Politique nationale de santé (PNS)'),
(101, 8, 'Plan stratégique national (PSN)'),
(102, 8, 'Stratégie Nationale'),
(103, 8, 'Plan national de contingence (PNC)'),
(104, 8, 'Plan stratégique pour la lutte contre les maladies tropicales négligées (PSM MTN)'),
(105, 2, 'DHIS2 Programme'),
(106, 7, 'Politique Nationale de Recherche pour la Santé'),
(107, 13, 'Système d\'Information Sanitaire');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `is_verified`) VALUES
(1, 'superadmin@gmail.com', '[\"ROLE_ADMIN\", \"ROLE_USER\"]', '$2y$13$dVeEQH7UojMyyevxpJUQieeFTqloU1PHdCJM9KDFfpGNa/L9Po9Y2', 1),
(11, 'depsi@gmail.com', '[\"ROLE_ADMIN\",\"ROLE_USER\"]', '$2y$13$ZqJHiUOECl5Hss1tbycGt.bX3Y/r9lDItMXeY2kNDFx.52HSUIgIm', 1),
(15, 'userdepsi@gmail.com', '[\"ROLE_USER\"]', '$2y$13$TPTSn/tPj1ejwwFcZp9GCuA8WR7adHa7OGM6OFQwfpzznzfwA5phu', 1);

-- --------------------------------------------------------

--
-- Structure de la table `user_platform`
--

CREATE TABLE `user_platform` (
  `id` int(11) NOT NULL,
  `email_id` int(11) NOT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edited_at` datetime DEFAULT NULL,
  `statut` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_platform`
--

INSERT INTO `user_platform` (`id`, `email_id`, `address`, `created_at`, `firstname`, `lastname`, `edited_at`, `statut`, `phone`) VALUES
(1, 1, 'Antananarivo', '2022-11-30 15:33:06', 'Super', 'User', '2023-02-03 10:38:34', 'Actif', NULL),
(11, 11, 'Antananarivo\r\nMadagascar', '2023-02-19 18:28:48', 'Admin', 'DEPSI', '2023-04-15 17:58:28', 'Actif', NULL),
(15, 15, NULL, '2023-03-02 18:39:35', 'User', 'Depsi', '2023-05-02 20:19:09', 'Actif', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `visitor`
--

CREATE TABLE `visitor` (
  `id` int(11) NOT NULL,
  `infos` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `visitor`
--

INSERT INTO `visitor` (`id`, `infos`, `created_at`) VALUES
(161, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:35:08'),
(162, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:35:25'),
(163, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:35:43'),
(164, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:36:14'),
(165, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:36:23'),
(166, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:36:39'),
(167, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:37:19'),
(168, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:41:30'),
(169, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:41:36'),
(170, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:41:45'),
(171, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:48:16'),
(172, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:48:26'),
(173, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:56:07'),
(174, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:56:20'),
(175, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:56:29'),
(176, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:56:37'),
(177, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:58:09'),
(178, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:58:26'),
(179, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:58:36'),
(180, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:58:41'),
(181, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 10:58:53'),
(182, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:03:23'),
(183, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:04:34'),
(184, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:04:47'),
(185, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:04:54'),
(186, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:06:38'),
(187, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-24 11:39:00'),
(188, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:02:03'),
(189, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:05:44'),
(190, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:05:51'),
(191, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:06:37'),
(192, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:06:48'),
(193, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:06:53'),
(194, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:08:39'),
(195, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:09:14'),
(196, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:11:01'),
(197, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:15:25'),
(198, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:15:57'),
(199, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:16:06'),
(200, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:16:10'),
(201, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:38:04'),
(202, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:38:13'),
(203, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:38:15'),
(204, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:38:27'),
(205, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 00:38:32'),
(206, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 02:37:52'),
(207, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 02:38:45'),
(208, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-28 02:38:47'),
(209, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:00:13'),
(210, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:00:25'),
(211, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:02:37'),
(212, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:03:34'),
(213, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:18:36'),
(214, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:18:41'),
(215, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:19:36'),
(216, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:19:50'),
(217, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:20:29'),
(218, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:20:38'),
(219, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:29:59'),
(220, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:51:05'),
(221, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:54:54'),
(222, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:55:53'),
(223, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 08:57:22'),
(224, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-30 09:19:32'),
(225, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 10:59:16'),
(226, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:48:27'),
(227, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:48:30'),
(228, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:50:23'),
(229, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:50:32'),
(230, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:50:55'),
(231, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:51:21'),
(232, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:53:15'),
(233, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:55:12'),
(234, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:55:41'),
(235, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:59:15'),
(236, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 12:59:46'),
(237, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:03:03'),
(238, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:04:06'),
(239, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:04:30'),
(240, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:09:34'),
(241, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:09:59'),
(242, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:11:07'),
(243, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:12:33'),
(244, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:13:29'),
(245, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:14:49'),
(246, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:17:10'),
(247, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:18:07'),
(248, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:18:36'),
(249, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:22:41'),
(250, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:22:52'),
(251, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:23:12'),
(252, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:23:37'),
(253, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:23:41'),
(254, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:23:49'),
(255, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:25:56'),
(256, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:26:01'),
(257, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:26:12'),
(258, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 13:26:16'),
(259, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 14:07:03'),
(260, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-07-31 14:07:18'),
(261, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-01 08:59:44'),
(262, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-01 09:02:04'),
(263, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-01 09:02:11'),
(264, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-01 09:04:07'),
(265, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-02 20:00:21'),
(266, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-02 20:03:00'),
(267, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-02 20:03:03'),
(268, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:46:42'),
(269, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:46:49'),
(270, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:47:01'),
(271, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:48:28'),
(272, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:49:22'),
(273, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:50:11'),
(274, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:50:50'),
(275, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:53:28'),
(276, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:54:18'),
(277, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 14:59:45'),
(278, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:01:18'),
(279, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:01:21'),
(280, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:01:51'),
(281, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:02:24'),
(282, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:04:18'),
(283, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:04:23'),
(284, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:04:27'),
(285, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:07:11'),
(286, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:07:52'),
(287, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:07:56'),
(288, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:08:38'),
(289, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:08:47'),
(290, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:14:47'),
(291, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:14:56'),
(292, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:15:37'),
(293, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:16:01'),
(294, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:16:05'),
(295, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:18:32'),
(296, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:18:44'),
(297, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:19:31'),
(298, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:20:46'),
(299, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:20:50'),
(300, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:21:07'),
(301, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:22:13'),
(302, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:22:31'),
(303, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '2023-08-03 15:22:39'),
(304, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:40:46'),
(305, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:41:12'),
(306, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:43:24'),
(307, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:47:10'),
(308, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:47:22'),
(309, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:47:44'),
(310, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:47:53'),
(311, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:51:27'),
(312, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:52:19'),
(313, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:53:49'),
(314, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:53:53'),
(315, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:54:00'),
(316, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:54:05'),
(317, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:54:28'),
(318, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:54:32'),
(319, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:58:57'),
(320, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:59:05'),
(321, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:59:16'),
(322, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:59:45'),
(323, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 19:59:58'),
(324, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:00:44'),
(325, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:00:53'),
(326, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:00:57'),
(327, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:01:53'),
(328, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:03:12'),
(329, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:04:39'),
(330, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:04:45'),
(331, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:04:49'),
(332, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:04:53'),
(333, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:10:48'),
(334, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:10:56'),
(335, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:11:54'),
(336, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:13:51'),
(337, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:16:14'),
(338, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:17:22'),
(339, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:17:47'),
(340, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:19:12'),
(341, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:19:31'),
(342, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:23:41'),
(343, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:25:38'),
(344, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:35:37'),
(345, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:40:19'),
(346, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 20:40:37'),
(347, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:24:34'),
(348, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:25:17'),
(349, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:25:31'),
(350, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:25:51'),
(351, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:57:02'),
(352, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:57:28'),
(353, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 21:57:40'),
(354, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:02:55'),
(355, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:04:02'),
(356, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:13:57'),
(357, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:14:05'),
(358, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:29:19'),
(359, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:29:38'),
(360, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:30:31'),
(361, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:36:22'),
(362, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:36:29'),
(363, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:40:20'),
(364, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:41:09'),
(365, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:44:10'),
(366, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:44:20'),
(367, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-04 23:44:55'),
(368, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:28:19'),
(369, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:28:41'),
(370, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:32:50'),
(371, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:32:59'),
(372, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:33:35'),
(373, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:36:41'),
(374, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:38:47'),
(375, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:39:09'),
(376, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:39:26'),
(377, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:39:38'),
(378, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:39:43'),
(379, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:41:48'),
(380, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 09:42:12'),
(381, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:02:15'),
(382, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:02:18'),
(383, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:02:36'),
(384, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:03:22'),
(385, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:03:25'),
(386, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:03:44'),
(387, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:03:49'),
(388, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:05:13'),
(389, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:08:24'),
(390, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:12:57'),
(391, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:20:07'),
(392, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:20:15'),
(393, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:32:27'),
(394, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:40:36'),
(395, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:48:29'),
(396, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:48:53'),
(397, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 10:57:40'),
(398, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 11:06:55'),
(399, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 11:16:42'),
(400, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 11:21:20'),
(401, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 14:45:27'),
(402, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 15:46:04'),
(403, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-07 15:47:40'),
(404, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:47:13'),
(405, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:47:27'),
(406, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:49:11'),
(407, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:49:56'),
(408, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:50:56'),
(409, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:51:46'),
(410, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:52:58'),
(411, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-09 15:54:36'),
(412, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:43:52'),
(413, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:47:17'),
(414, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:47:36'),
(415, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:48:09'),
(416, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:48:37'),
(417, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:49:12'),
(418, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-10 03:50:39'),
(419, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-11 09:58:20'),
(420, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-11 09:58:33'),
(421, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-11 10:04:56'),
(422, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-11 10:09:05'),
(423, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-11 10:09:10'),
(424, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-16 08:49:03'),
(425, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-23 09:08:26'),
(426, 'IP 127.0.0.1; Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0', '2023-08-24 08:59:04');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `about_moh`
--
ALTER TABLE `about_moh`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `direction`
--
ALTER TABLE `direction`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `documentary_resources`
--
ALTER TABLE `documentary_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_27C15759AF73D997` (`direction_id`),
  ADD KEY `IDX_27C157596145D7DB` (`entities_id`),
  ADD KEY `IDX_27C15759C5D8F75` (`posttype_id`),
  ADD KEY `IDX_27C1575959027487` (`theme_id`);

--
-- Index pour la table `entities`
--
ALTER TABLE `entities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_50EC64E5AF73D997` (`direction_id`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `info`
--
ALTER TABLE `info`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `key_figure`
--
ALTER TABLE `key_figure`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Index pour la table `organigrammedepsi`
--
ALTER TABLE `organigrammedepsi`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `post_type`
--
ALTER TABLE `post_type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_154232DEC5D8F75` (`posttype_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`);

--
-- Index pour la table `user_platform`
--
ALTER TABLE `user_platform`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_D9DF34CBA832C1C9` (`email_id`);

--
-- Index pour la table `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `about_moh`
--
ALTER TABLE `about_moh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `direction`
--
ALTER TABLE `direction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `documentary_resources`
--
ALTER TABLE `documentary_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `entities`
--
ALTER TABLE `entities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `home`
--
ALTER TABLE `home`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `info`
--
ALTER TABLE `info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `key_figure`
--
ALTER TABLE `key_figure`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `organigrammedepsi`
--
ALTER TABLE `organigrammedepsi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `post_type`
--
ALTER TABLE `post_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `user_platform`
--
ALTER TABLE `user_platform`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `visitor`
--
ALTER TABLE `visitor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=427;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `documentary_resources`
--
ALTER TABLE `documentary_resources`
  ADD CONSTRAINT `FK_27C1575959027487` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`),
  ADD CONSTRAINT `FK_27C157596145D7DB` FOREIGN KEY (`entities_id`) REFERENCES `entities` (`id`),
  ADD CONSTRAINT `FK_27C15759AF73D997` FOREIGN KEY (`direction_id`) REFERENCES `direction` (`id`),
  ADD CONSTRAINT `FK_27C15759C5D8F75` FOREIGN KEY (`posttype_id`) REFERENCES `post_type` (`id`);

--
-- Contraintes pour la table `entities`
--
ALTER TABLE `entities`
  ADD CONSTRAINT `FK_50EC64E5AF73D997` FOREIGN KEY (`direction_id`) REFERENCES `direction` (`id`);

--
-- Contraintes pour la table `themes`
--
ALTER TABLE `themes`
  ADD CONSTRAINT `FK_154232DEC5D8F75` FOREIGN KEY (`posttype_id`) REFERENCES `post_type` (`id`);

--
-- Contraintes pour la table `user_platform`
--
ALTER TABLE `user_platform`
  ADD CONSTRAINT `FK_D9DF34CBA832C1C9` FOREIGN KEY (`email_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
