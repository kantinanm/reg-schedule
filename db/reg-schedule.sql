-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 29, 2018 at 02:32 AM
-- Server version: 5.7.17-log
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reg-schedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `schedule_id` int(11) NOT NULL,
  `sub_id` varchar(6) NOT NULL,
  `col` int(3) NOT NULL,
  `dates` bigint(20) NOT NULL,
  `start` int(3) NOT NULL,
  `end` int(3) NOT NULL,
  `span` int(3) NOT NULL,
  `room` varchar(50) NOT NULL,
  `internet_account` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `sub_id`, `col`, `dates`, `start`, `end`, `span`, `room`, `internet_account`) VALUES
(1, '305211', 6, 1541005200000, 14, 17, 3, 'EE 113', 'mattareeyar'),
(2, '305172', 1, 1541091600000, 9, 12, 3, 'EE 113', 'mattareeyar');

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `internet_account` varchar(50) NOT NULL,
  `prename` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `fix_gender` varchar(10) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL,
  `profile_type` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `teacher_code` varchar(50) DEFAULT NULL,
  `eng_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`internet_account`, `prename`, `firstname`, `lastname`, `fix_gender`, `position`, `user_role`, `profile_type`, `photo`, `email`, `room`, `teacher_code`, `eng_name`) VALUES
('akaraphuntv', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อัครพันธ์', 'วงศ์กังแห', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('chairatp', 'ดร.', 'ชัยรัตน์', 'พินทอง', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('jirapornpook', 'นางสาว', 'จิราพร', 'พุกสุข', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('jirawadeep', 'ดร.', 'จิรวดี ', 'ผลประเสริฐ', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('kantinanm', 'นาย', 'กันตินันท์', 'มากมี', 'M', 'นักวิชาการคอมพิวเตอร์', 'Admin', NULL, NULL, NULL, NULL, NULL, NULL),
('kingrise', 'Mr.', 'Yoseung', 'KIM', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('kusumat', 'นางสาว', 'สารินทร์', 'เติมสุทา', 'F', 'เจ้าหน้าที่บริหารทั่วไป', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('mattareeyar', 'นางสาว', 'มัทรียา', 'ราชบัวศรี', 'F', 'นักวิชาการคอมพิวเตอร์', 'Admin', NULL, NULL, NULL, NULL, NULL, NULL),
('mutitas', 'ผู้ช่วยศาสตราจารย์ ดร.', 'มุฑิตา', 'สงฆ์จันทร์', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('niphatj', 'ผู้ช่วยศาสตราจารย์ ดร. ', 'นิพัทธ์', 'จันทรมินทร์', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('paisarnmu', 'รองศาสตราจารย์ ดร.', 'ไพศาล', 'มุณีสว่าง', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('panomkhawnr', 'ผู้ช่วยศาสตราจารย์ ดร.', 'พนมขวัญ', 'ริยะมงคล', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('panupongs', 'นาย', 'ภาณุพงศ์', 'สอนคม', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('panusn', 'ผู้ช่วยศาสตราจารย์ ดร.', 'พนัส', 'นัถฤทธิ์', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('paopats', 'นาย', 'เผ่าพัฒน์', 'แสงอบ', 'M', 'ครูช่าง', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('pawanratm', 'นางสาว', 'ปวันรัตน์', 'มั่นนุช', 'F', 'ครูช่าง', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('phisuta', 'ดร.', 'พิสุทธิ์ ', 'อภิชยกุล', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('phongphunk', 'ผู้ช่วยศาสตราจารย์ ดร.', 'พงศ์พันธ์', 'กิจสนาโยธิน', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('piyadanip', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ปิยดนัย', 'ภาชนะพรรณ์', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('rathapoomw', 'นาย', 'รัฐภูมิ', 'วรานุสาสน์', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('sangchaim', 'นาย', 'แสงชัย', 'มังกรทอง', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('sarawutw', 'ดร.', 'สราวุฒิ', 'วัฒนวงค์พิทักษ์', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('setthat', 'นาย', 'เศรษฐา', 'ตั้งค้าวานิช', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('siripornd', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ศิริพร', 'เดชะศิลารักษ์', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('sompornr', 'ผู้ช่วยศาสตราจารย์ ดร.', 'สมพร', 'เรืองสินชัยวานิช', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('sucharty', 'รองศาสตราจารย์ ดร.', 'สุชาติ', 'แย้มเม่น', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('sukanyap', 'นางสาว', 'สุกัญญา', 'ผนึกทอง', 'F', 'เจ้าหน้าที่บริหารทั่วไป', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('supannikayo', 'ผู้ช่วยศาสตราจารย์ ดร.', 'สุพรรณนิกา', 'วัฒนะ', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('supawanph', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ศุภวรรณ', 'พลพิทักษ์ชัย', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('surachetka', 'ผู้ช่วยศาสตราจารย์ ดร.', 'สุรเชษฐ์', 'กานต์ประชา', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('Suradet', 'ดร.', 'สุรเดช', 'จิตประไพกุลศาล', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('suwitki', 'รองศาสตราจารย์ ดร.', 'สุวิทย์', 'กิระวิทยา', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('taneek', 'ว่าที่ร้อยตรี', 'ธานี', 'โกสุม', 'M', 'ครูช่าง', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('tanitm', 'รองศาสตราจารย์ ดร.', 'ธนิต', 'มาลากร', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('thawatchaim', 'รองศาสตราจารย์ ดร.', 'ธวัชชัย', 'เมธีวรัญญู', 'M', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL),
('woralakk', 'ดร.', 'วรลักษณ์', 'คงเด่นฟ้า', 'F', 'Lecturer', 'normal', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`internet_account`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
