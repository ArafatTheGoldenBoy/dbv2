-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2021 at 03:41 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dwt`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_pupil`
--

CREATE TABLE `assigned_pupil` (
  `assign_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user as student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assigned_pupil`
--

INSERT INTO `assigned_pupil` (`assign_id`, `class_id`, `user_id`) VALUES
(28, 2, 51),
(34, 21, 32),
(39, 27, 53),
(43, 2, 54),
(44, 21, 41),
(50, 1, 55);

-- --------------------------------------------------------

--
-- Table structure for table `assign_teacher`
--

CREATE TABLE `assign_teacher` (
  `assign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assign_teacher`
--

INSERT INTO `assign_teacher` (`assign_id`, `user_id`, `subject_id`, `created_at`) VALUES
(1, 40, 1, '2021-06-10 02:50:38'),
(2, 38, 2, '2021-06-10 02:50:38'),
(3, 43, 7, '2021-06-24 06:56:57'),
(4, 43, 4, '2021-06-24 06:57:47'),
(5, 43, 8, '2021-06-25 02:18:41'),
(7, 52, 14, '2021-06-27 00:13:19'),
(8, 52, 15, '2021-06-27 05:21:00'),
(9, 52, 17, '2021-06-27 06:58:26'),
(10, 43, 18, '2021-06-28 12:26:31'),
(11, 43, 19, '2021-06-29 00:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(32) NOT NULL,
  `is_archived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `class_name`, `is_archived`) VALUES
(1, 'class9', 0),
(2, 'class10', 0),
(19, 'class8', 0),
(20, 'class7', 0),
(21, 'class1', 0),
(22, 'classx', 1),
(23, 'class z', 1),
(24, 'class xy', 1),
(25, 'class xyz', 1),
(26, 'class z1', 1),
(27, 'class z2', 0),
(28, 'class z3', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mark`
--

CREATE TABLE `mark` (
  `mark_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user as student',
  `marks` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mark`
--

INSERT INTO `mark` (`mark_id`, `test_id`, `user_id`, `marks`) VALUES
(1, 11, 53, 80),
(4, 2, 32, 60),
(5, 3, 41, 2.5),
(6, 4, 41, 3.5),
(7, 5, 41, 1.5),
(8, 6, 41, 3),
(9, 5, 32, 1),
(10, 6, 32, 4),
(11, 3, 32, 1.5),
(12, 4, 32, 1.2),
(50, 5, 51, 2),
(51, 6, 51, 3),
(54, 16, 41, 2.2);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(32) NOT NULL,
  `class_id` int(11) NOT NULL,
  `is_archived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `subject_name`, `class_id`, `is_archived`) VALUES
(3, 'Math', 21, 0),
(4, 'Math2', 20, 1),
(6, 'English1', 21, 1),
(7, 'English12', 20, 1),
(9, 'Sport', 19, 0),
(10, 'a', 22, 1),
(13, 'Math3', 21, 0),
(15, 'DWT', 19, 0),
(16, 'q', 2, 1),
(17, 'z', 19, 0),
(18, '123', 21, 0),
(19, 'z4', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `test_id` int(11) NOT NULL,
  `test_name` varchar(32) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_complete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`test_id`, `test_name`, `subject_id`, `date`, `is_complete`) VALUES
(1, '1st semister', 3, '2021-06-19 20:03:38', 0),
(2, '1st semister', 6, '2021-06-19 20:24:51', 1),
(3, 'test1', 4, '2021-06-21 18:56:47', 1),
(4, 'test2', 4, '2021-06-21 18:56:47', 1),
(5, 'test3', 7, '2021-06-21 18:57:18', 1),
(6, 'test4', 7, '2021-06-21 18:57:18', 1),
(8, 'test4', 10, '2021-06-25 21:44:15', 1),
(11, 'x', 16, '2021-06-27 02:32:32', 0),
(15, 'x', 4, '2021-06-27 02:48:24', 0),
(16, 'q', 18, '2021-06-28 12:32:40', 1),
(17, 't1', 19, '2021-06-29 00:37:11', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `password` varchar(256) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `user_type` varchar(8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `password`, `first_name`, `last_name`, `user_type`, `created_at`) VALUES
(28, 'yasina', '$2b$10$ubvWMPzGRhQdj2lxY5DWM.T2bChgk/8Onv5t0PMZZtB4gYrBwNcMa', 'md', 'yasin', 'admin', '2021-06-18 22:36:09'),
(32, 'safin123', '$2b$10$.wUE6W5KEfgQVA0j10pOdug1cfi6.31NKKbxMsk7JapXgItVj7Aq.', 'md1', 'safin', 'student', '2021-06-18 22:37:42'),
(41, 'pogba', '$2b$10$qvtJzJ.AC8cJfjTNVSsSC.kAvwVtRZnSm5esTQBW28ZP1Z5KtDIYu', 'md1', 'pogba', 'student', '2021-06-19 19:11:14'),
(42, 'ronaldo', '$2b$10$caHdrkuytvqnHfT/6hB0AunX5Vnc4WzRMiKFvU2Ju6fWwgT9gMioO', 'Yasin', 'Arafat', 'admin', '2021-06-22 19:54:44'),
(43, 'messi', '$2b$10$53OInNqEwLym.NvH6OmY2eW.e2nOf0L5PKLNkMKsZcveRueHxDAgm', 'm', 'i', 'teacher', '2021-06-24 06:52:05'),
(51, 'abc', '$2b$10$aw70NA2XGNploF3bMFbz.uOxyODefJjNY4Lad8136C.c8nLaEXVRq', 'a', 'b', 'student', '2021-06-25 22:13:42'),
(52, 'arafat', '$2b$10$DFiltgQ.64yW.Yw5jykehOFy8Xf7f4c5v0yqrHLu5PaeUirBEMYG.', 'a', 'b', 'teacher', '2021-06-27 00:12:59'),
(53, 'xy', '$2b$10$MdNfLZsNuKLAYbERwX32Te5.mT.tF/W4YBhOBJjyOHaDFkatWRn4K', 'x', 'y', 'student', '2021-06-27 03:53:25'),
(54, 'z1', '$2b$10$Fr3hJYHiAQWXbLlGibO28OplyH0ylIzrMogbSnc39TXEGrd7o0.Xy', '123', '123', 'student', '2021-06-27 07:09:50'),
(55, 'z2', '$2b$10$HpN8nh95nmns.IOMBFpLleHaSBA/PU4ouFF94HvsNbYuFaEKrec2W', 'e', 'e', 'student', '2021-06-27 07:37:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  ADD PRIMARY KEY (`assign_id`),
  ADD KEY `FK_assign_class_id` (`class_id`),
  ADD KEY `FK_assign_user_id` (`user_id`);

--
-- Indexes for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`),
  ADD UNIQUE KEY `class_name` (`class_name`);

--
-- Indexes for table `mark`
--
ALTER TABLE `mark`
  ADD PRIMARY KEY (`mark_id`),
  ADD KEY `FK_user_id` (`user_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_name` (`subject_name`),
  ADD KEY `FK_class_id` (`class_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `FK_subject_id` (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `mark`
--
ALTER TABLE `mark`
  MODIFY `mark_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  ADD CONSTRAINT `FK_assign_class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  ADD CONSTRAINT `FK_assign_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `mark`
--
ALTER TABLE `mark`
  ADD CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `FK_class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`);

--
-- Constraints for table `test`
--
ALTER TABLE `test`
  ADD CONSTRAINT `FK_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
