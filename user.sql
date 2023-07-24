--
-- Database: `db_appdepsi`
--

-- --------------------------------------------------------

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `is_verified`) VALUES
(1, 'superadmin@gmail.com', '[\"ROLE_ADMIN\", \"ROLE_USER\"]', '$2y$13$dVeEQH7UojMyyevxpJUQieeFTqloU1PHdCJM9KDFfpGNa/L9Po9Y2', 1),
(11, 'depsi@gmail.com', '[\"ROLE_ADMIN\",\"ROLE_USER\"]', '$2y$13$ZqJHiUOECl5Hss1tbycGt.bX3Y/r9lDItMXeY2kNDFx.52HSUIgIm', 1),
(15, 'userdepsi@gmail.com', '[\"ROLE_USER\"]', '$2y$13$TPTSn/tPj1ejwwFcZp9GCuA8WR7adHa7OGM6OFQwfpzznzfwA5phu', 1);