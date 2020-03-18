CREATE DATABASE `showplex` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `freeboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usernum` int NOT NULL,
  `title` varchar(45) NOT NULL,
  `contents` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `author` varchar(45) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `log` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `usernum` int NOT NULL,
  `country` varchar(45) DEFAULT NULL,
  `loginTime` varchar(45) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `device` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `user` (
  `usernum` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(512) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `verifyNumber` varchar(45) DEFAULT NULL,
  `verify` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`usernum`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
