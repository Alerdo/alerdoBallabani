-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: companydirectory
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Human Resources',2),(2,'Sales',3),(3,'Marketing',2),(4,'Legal',1),(5,'Services',1),(6,'Research and Development',3),(7,'Product Management',3),(8,'Training',4),(9,'Support',4),(10,'Engineering',5),(11,'Accountings',5),(12,'Business Development',3),(20,'asdsasad',NULL),(26,'adwdwad',5);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'London'),(2,'New York'),(3,'Paris'),(4,'Munich'),(5,'Rome'),(21,'Tirana');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personnel`
--

DROP TABLE IF EXISTS `personnel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `jobTitle` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `departmentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personnel`
--

LOCK TABLES `personnel` WRITE;
/*!40000 ALTER TABLE `personnel` DISABLE KEYS */;
INSERT INTO `personnel` VALUES (1,'Robert','Heffron','','rheffron0@ibm.com',1),(2,'Kris','Kovnot','','kkovnot1@google.nl',2),(3,'Vera','Kisbee','','vkisbee2@nih.gov',2),(4,'Aveline','Edgson','','aedgson3@wikispaces.com',3),(5,'Bertie','Wittke','','bwittke4@yahoo.com',4),(6,'Demetre','Cossam','','dcossam5@washington.edu',5),(9,'Cordula','Plain','','cplain8@google.ca',5),(10,'Glen','McDougle','','gmcdougle9@meetup.com',6),(11,'Theo','Audas','','taudasa@newsvine.com',7),(15,'Suzie','Cromer','','scromere@imageshack.us',1),(16,'Tracee','Gisbourn','','tgisbournf@bloglines.com',10),(17,'Taylor','St. Quintin','','tstquinting@chronoengine.com',10),(18,'Lin','Klassmann','','lklassmannh@indiatimes.com',10),(19,'Lay','Fintoph','','lfintophi@goo.gl',11),(20,'Moishe','Flinn','','mflinnj@list-manage.com',12),(21,'Gay','Bickford','','gbickfordk@scientificamerican.com',6),(22,'Erik','Lindback','','elindbackl@virginia.edu',8),(23,'Tamarra','Ace','','tacem@vinaora.com',9),(25,'Lucien','Allsup','','lallsupo@goo.ne.jp',9),(26,'Jackelyn','Imlach','','jimlachp@google.it',11),(27,'Virge','Bootes','','vbootesq@oracle.com',2),(28,'Rafferty','Matasov','','rmatasovr@4shared.com',4),(29,'Vanya','Goulder','','vgoulders@phoca.cz',9),(30,'Bonita','McGonagle','','bmcgonaglet@microsoft.com',1),(31,'Allxee','Whaley','','awhaleyu@bbb.org',2),(33,'Vern','Durling','','vdurlingw@goo.gl',1),(34,'Myles','Minchi','','mminchix@smugmug.com',7),(37,'Rahal','Tute','','rtute10@pinterest.com',6),(38,'Warner','Blonden','','wblonden11@spiegel.de',12),(39,'Melvyn','Canner','','mcanner12@eepurl.com',4),(40,'Ryann','Giampietro','','rgiampietro13@theguardian.com',4),(41,'Harwell','Jefferys','','hjefferys14@jimdo.com',10),(42,'Lanette','Buss','','lbuss15@51.la',4),(43,'Lissie','Reddington','','lreddington16@w3.org',9),(44,'Dore','Braidford','','dbraidford17@google.com.br',11),(45,'Lizabeth','Di Franceshci','','ldifranceshci18@mediafire.com',8),(46,'Felic','Sharland','','fsharland19@myspace.com',12),(47,'Duff','Quail','','dquail1a@vimeo.com',9),(48,'Brendis','Shivell','','bshivell1b@un.org',1),(49,'Nevile','Schimaschke','','nschimaschke1c@hexun.com',10),(50,'Jon','Calbaithe','','jcalbaithe1d@netvibes.com',4),(51,'Emmery','Darben','','edarben1e@mapquest.com',10),(52,'Staford','Whitesel','','swhitesel1f@nasa.gov',6),(53,'Benjamin','Hawkslee','','bhawkslee1g@hubpages.com',7),(55,'Matthus','Banfield','','mbanfield1i@angelfire.com',3),(57,'Rinaldo','Fandrey','','rfandrey1k@bbc.co.uk',2),(58,'Roanna','Standering','','rstandering1l@cocolog-nifty.com',3),(59,'Lorrie','Fattorini','','lfattorini1m@geocities.jp',9),(60,'Talbot','Andrassy','','tandrassy1n@bigcartel.com',4),(61,'Cindia','O\'Mannion','','comannion1o@ameblo.jp',11),(62,'Pancho','Mullineux','','pmullineux1p@webmd.com',1),(63,'Cynthy','Peyntue','','cpeyntue1q@amazon.co.jp',6),(64,'Kristine','Christal','','kchristal1r@behance.net',8),(65,'Dniren','Reboulet','','dreboulet1s@360.cn',7),(66,'Abaasaaz','Babababa','','blabla@gmail.com',2),(67,'Gayleen','Hessay','','ghessay1u@exblog.jp',4),(68,'Cull','Snoden','','csnoden1v@so-net.ne.jp',1),(69,'Vlad','Crocombe','','vcrocombe1w@mtv.com',7),(70,'Georgeanna','Joisce','','gjoisce1x@google.com.au',6),(71,'Ursola','Berthomieu','','uberthomieu1y@un.org',4),(72,'Mair','McKirdy','','mmckirdy1z@ovh.net',1),(73,'Erma','Runnalls','','erunnalls20@spiegel.de',8),(74,'Heida','Gallone','','hgallone21@hostgator.com',10),(75,'Christina','Denge','','cdenge22@canalblog.com',12),(76,'Wilone','Fredi','','wfredi23@gizmodo.com',7),(77,'Stormie','Bolderstone','','sbolderstone24@globo.com',11),(78,'Darryl','Pool','','dpool25@vistaprint.com',11),(79,'Nikolas','Mager','','nmager26@nifty.com',5),(80,'Brittney','Gaskal','','bgaskal27@weather.com',10),(81,'Field','Gresty','','fgresty28@networkadvertising.org',4),(82,'Martina','Tremoulet','','mtremoulet29@sciencedaily.com',3),(83,'Robena','Ivanyutin','','rivanyutin2a@mozilla.org',2),(84,'Reagen','Corner','','rcorner2b@qq.com',11),(85,'Eveleen','Sulter','','esulter2c@nature.com',6),(86,'Christy','Dunbobbin','','cdunbobbin2d@feedburner.com',8),(87,'Winthrop','Lansley','','wlansley2e@alibaba.com',8),(88,'Lissa','Insley','','linsley2f@friendfeed.com',3),(89,'Shell','Risebarer','','srisebarer2g@patch.com',10),(90,'Cherianne','Liddyardas','','cliddyard2h@com.com',2),(91,'Brendan','Fooks','','bfooks2i@utexas.edu',2),(92,'Edmund','Tace','','etace2j@hatena.ne.jp',9),(93,'Ki','Tomasini','','ktomasini2k@cnbc.com',10),(94,'Chadd','McGettrick','','cmcgettrick2l@simplemachines.org',10),(95,'Dulcie','Baudi','','dbaudi2m@last.fm',3),(97,'Stefanie','Anker','','sanker2o@hud.gov',5),(98,'Cherye','de Cullip','','cdecullip2p@loc.gov',10),(99,'Sinclare','Deverall','','sdeverall2q@ow.ly',6),(100,'Shae','Johncey','','sjohncey2r@bluehost.com',10),(101,'Alerdo','Ballabani','Sales',NULL,NULL),(102,'','','sad',NULL,NULL),(109,'awdw','wadwad',NULL,'alerdo23@gmail.com',2),(110,'adw','awd',NULL,'alerdo23@gmail.com',2),(111,'wd','wddaw',NULL,'alerdo23@gmail.com',2),(116,'Alerdo','Ballabani',NULL,'alerdo23@gmail.com',2);
/*!40000 ALTER TABLE `personnel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-25 14:31:02
