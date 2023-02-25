--
-- Insert admins to table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
(1,'giang@gmail.com','$2b$10$wZh2Y/RjiUt.V5szJaWxYOOnj8hvqxFm2w84GmhQ8u2oe7x8Z5gGO','Giang','Nguyen',1,'empty-profile',0),
(2,'linh@gmail.com','$2b$10$BjTp3xkBrsJ2guQRSecMmOhxZyfiAz/mQwY8i3h3NEeTYIyfRMXCu','Linh','Pham',1,'empty-profile',0),
(3,'charlene@gmail.com','$2b$10$R8gShbFuOU7xcpXsBzl/X.G3qQC.Oob7JqatLBvzOt8Lv509YOUpe','Charlene','Kimbrell',1,'empty-profile',0),
(4,'zinc@gmail.com','$2b$10$oMXKEU9HRA82Ys14qgu5Xuy8jH9ckwwI1EgyqQAVEGn2IFlFiyAHG','Camille','Usita',1,'empty-profile',0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
