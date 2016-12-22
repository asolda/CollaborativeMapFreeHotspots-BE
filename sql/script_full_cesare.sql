-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 22, 2016 at 10:04 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gopher_main`
--

-- --------------------------------------------------------

--
-- Table structure for table `rete_wifi`
--

CREATE TABLE `rete_wifi` (
  `id` int(11) NOT NULL,
  `ssid` varchar(30) NOT NULL,
  `qualità` float NOT NULL,
  `latitudine` double NOT NULL,
  `longitudine` double NOT NULL,
  `numero_recensioni` int(11) DEFAULT '0',
  `necessità_login` tinyint(1) DEFAULT '0',
  `restrizioni` text,
  `altre_informazioni` text,
  `range_wifi` int(11) NOT NULL DEFAULT '0',
  `numero_segnalazioni` int(11) DEFAULT '0',
  `utente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rete_wifi`
--

INSERT INTO `rete_wifi` (`id`, `ssid`, `qualità`, `latitudine`, `longitudine`, `numero_recensioni`, `necessità_login`, `restrizioni`, `altre_informazioni`, `range_wifi`, `numero_segnalazioni`, `utente`) VALUES
(1, 'villa vannucchi wifi', 4, 40.829505, 14.337394, 0, 0, 'restrizioni...', 'altre informazioni', 50, 0, 26),
(2, 'via_manzoni_hotspot', 4, 40.839897, 14.341471, 0, 0, 'restrizioni...', 'altre informazioni', 150, 0, 46),
(3, 'pizzeriadelicato', 4, 40.836439, 14.343424, 0, 0, 'restrizioni...', 'altre informazioni', 50, 0, 46),
(4, 'mensile_wifi', 4, 40.834483, 14.344744, 0, 0, 'restrizioni...', 'altre informazioni', 30, 0, 46),
(5, 'doriangray_hotspot', 4, 40.831975, 14.346106, 0, 0, 'restrizioni...', 'altre informazioni', 70, 0, 46),
(6, 'chalet_troisi', 4, 40.831634, 14.338596, 0, 0, 'restrizioni...', 'altre informazioni', 60, 0, 46),
(7, 'latavernetta.wifi', 4, 40.832867, 14.342008, 0, 0, 'restrizioni...', 'altre informazioni', 50, 0, 30),
(8, 'viaSanMartino hotspot', 4, 40.832752, 14.332867, 0, 0, 'restrizioni...', 'altre informazioni', 150, 0, 30),
(9, 'villa Bruno wifi', 4, 40.826914, 14.339476, 0, 0, 'restrizioni...', 'altre informazioni', 180, 0, 30),
(10, 'Paninopolis hotspot', 4, 40.832232, 14.346578, 0, 0, 'restrizioni...', 'altre informazioni', 60, 0, 30);

-- --------------------------------------------------------

--
-- Table structure for table `segnalazione`
--

CREATE TABLE `segnalazione` (
  `utente` int(11) NOT NULL,
  `rete_wifi` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `dettagli` text NOT NULL,
  `visualizzato` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sessione`
--

CREATE TABLE `sessione` (
  `session_id` char(32) NOT NULL,
  `user_agent` varchar(30) NOT NULL,
  `indirizzo_ip` varchar(15) NOT NULL,
  `ultimo_accesso` date NOT NULL,
  `utente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `utente`
--

CREATE TABLE `utente` (
  `id` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `utente`
--

INSERT INTO `utente` (`id`, `email`, `password`) VALUES
(1, 'stone@meekness.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(2, 'ca-tech@dps.centrin.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(3, 'trinanda_lestyowati@telkomsel.', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(4, 'asst_dos@astonrasuna.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(5, 'amartabali@dps.centrin.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(6, 'achatv@cbn.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(7, 'bali@tuguhotels.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(8, 'baliminimalist@yahoo.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(9, 'bliss@thebale.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(10, 'adhidharma@denpasar.wasantara.', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(11, 'centralreservation@ramayanahot', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(12, 'apribadi@balimandira.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(13, 'cdagenhart@ifc.org', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(14, 'dana_supriyanto@interconti.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(15, 'dos@novotelbali.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(16, 'daniel@hotelpadma.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(17, 'daniel@balibless.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(18, 'djoko_p@jayakartahotelsresorts', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(19, 'expdepot@indosat.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(20, 'feby.adamsyah@idn.xerox.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(21, 'christian_rizal@interconti.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(22, 'singgih93@mailcity.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(23, 'idonk_gebhoy@yahoo.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(24, 'info@houseofbali.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(25, 'kyohana@toureast.net', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(26, 'sales@nusaduahotel.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(27, 'jayakarta@mataram.wasantara.ne', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(28, 'mapindo@indo.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(29, 'sm@ramayanahotel.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(30, 'anekabeach@dps.centrin.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(31, 'yogya@jayakartahotelsresorts.c', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(32, 'garudawisatajaya@indo.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(33, 'ketut@kbatur.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(34, 'bondps@bonansatours.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(35, 'witamgr@dps.centrin.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(36, 'dtedja@indosat.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(37, 'info@stpbali.ac.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(38, 'baliprestigeho@dps.centrin.net', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(39, 'pamilu@mas-travel.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(40, 'amandabl@indosat.net.id', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(41, 'marketing@csdwholiday.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(42, 'luha89@yahoo.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(43, 'indahsuluh2002@yahoo.com.sg', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(44, 'imz1991@yahoo.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(45, 'gus_war81@yahoo.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3'),
(46, 'cesaretucci95@gmail.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');

-- --------------------------------------------------------

--
-- Table structure for table `valuta`
--

CREATE TABLE `valuta` (
  `utente` int(11) NOT NULL,
  `rete_wifi` int(11) NOT NULL,
  `voto` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rete_wifi`
--
ALTER TABLE `rete_wifi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_rete_wifi_UTENTE` (`utente`);

--
-- Indexes for table `segnalazione`
--
ALTER TABLE `segnalazione`
  ADD PRIMARY KEY (`utente`,`rete_wifi`,`tipo`),
  ADD KEY `FK_segnalazione_RETE_WIFI` (`utente`) USING BTREE,
  ADD KEY `FK_segnalazione_UTENTE` (`rete_wifi`) USING BTREE;

--
-- Indexes for table `sessione`
--
ALTER TABLE `sessione`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `FK_sessione_UTENTE` (`utente`);

--
-- Indexes for table `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `valuta`
--
ALTER TABLE `valuta`
  ADD PRIMARY KEY (`utente`,`rete_wifi`),
  ADD KEY `FK_valuta_RETE_WIFI` (`utente`) USING BTREE,
  ADD KEY `FK_valuta_UTENTE` (`rete_wifi`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rete_wifi`
--
ALTER TABLE `rete_wifi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `utente`
--
ALTER TABLE `utente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `rete_wifi`
--
ALTER TABLE `rete_wifi`
  ADD CONSTRAINT `FK_rete_wifi_UTENTE` FOREIGN KEY (`utente`) REFERENCES `utente` (`id`);

--
-- Constraints for table `segnalazione`
--
ALTER TABLE `segnalazione`
  ADD CONSTRAINT `FK_segnalazione_RETE_WIFI` FOREIGN KEY (`rete_wifi`) REFERENCES `rete_wifi` (`id`),
  ADD CONSTRAINT `FK_segnalazione_UTENTE` FOREIGN KEY (`utente`) REFERENCES `utente` (`id`);

--
-- Constraints for table `sessione`
--
ALTER TABLE `sessione`
  ADD CONSTRAINT `FK_sessione_UTENTE` FOREIGN KEY (`utente`) REFERENCES `utente` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
