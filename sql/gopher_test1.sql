-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Creato il: Gen 10, 2017 alle 23:29
-- Versione del server: 10.1.19-MariaDB
-- Versione PHP: 7.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
DROP DATABASE IF EXISTS `gopher_test1` ;
--
-- Database: `gopher_test1`
--
CREATE DATABASE IF NOT EXISTS `gopher_test1` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `gopher_test1`;

-- --------------------------------------------------------

--
-- Struttura della tabella `rete_wifi`
--

DROP TABLE IF EXISTS `rete_wifi`;
CREATE TABLE IF NOT EXISTS `rete_wifi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `utente` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_rete_wifi_UTENTE` (`utente`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `rete_wifi`
--

INSERT INTO `rete_wifi` (`id`, `ssid`, `qualità`, `latitudine`, `longitudine`, `numero_recensioni`, `necessità_login`, `restrizioni`, `altre_informazioni`, `range_wifi`, `numero_segnalazioni`, `utente`) VALUES
(1, 'retetest', 5, 1, 2, 0, 0, NULL, NULL, 0, 0, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `segnalazione`
--

DROP TABLE IF EXISTS `segnalazione`;
CREATE TABLE IF NOT EXISTS `segnalazione` (
  `utente` int(11) NOT NULL,
  `rete_wifi` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `dettagli` text NOT NULL,
  `visualizzato` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`utente`,`rete_wifi`,`tipo`),
  KEY `FK_segnalazione_RETE_WIFI` (`utente`) USING BTREE,
  KEY `FK_segnalazione_UTENTE` (`rete_wifi`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `sessione`
--

DROP TABLE IF EXISTS `sessione`;
CREATE TABLE IF NOT EXISTS `sessione` (
  `session_id` char(64) NOT NULL,
  `user_agent` varchar(30) NOT NULL,
  `indirizzo_ip` varchar(15) NOT NULL,
  `ultimo_accesso` date NOT NULL,
  `utente` int(11) NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `FK_sessione_UTENTE` (`utente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `token`
--

DROP TABLE IF EXISTS `token`;
CREATE TABLE IF NOT EXISTS `token` (
  `token` varchar(44) NOT NULL,
  `email` varchar(30) NOT NULL,
  `creation_time` int(11) NOT NULL,
  PRIMARY KEY (`token`,`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

DROP TABLE IF EXISTS `utente`;
CREATE TABLE IF NOT EXISTS `utente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(30) NOT NULL,
  `password` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`id`, `email`, `password`) VALUES
(1, 'utentefittizio@mail.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');

-- --------------------------------------------------------

--
-- Struttura della tabella `valuta`
--

DROP TABLE IF EXISTS `valuta`;
CREATE TABLE IF NOT EXISTS `valuta` (
  `utente` int(11) NOT NULL,
  `rete_wifi` int(11) NOT NULL,
  `voto` int(11) NOT NULL,
  PRIMARY KEY (`utente`,`rete_wifi`),
  KEY `FK_valuta_RETE_WIFI` (`utente`) USING BTREE,
  KEY `FK_valuta_UTENTE` (`rete_wifi`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

  

-- Vincoli relazionali
ALTER TABLE rete_wifi
  ADD CONSTRAINT FK_rete_wifi_UTENTE FOREIGN KEY (utente) REFERENCES utente(id) ON DELETE CASCADE; 
  
ALTER TABLE segnalazione
  ADD CONSTRAINT FK_segnalazione_RETE_WIFI FOREIGN KEY (rete_wifi) REFERENCES rete_wifi(id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_segnalazione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id) ON DELETE CASCADE;

ALTER TABLE sessione
  ADD CONSTRAINT FK_sessione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id) ON DELETE CASCADE;
  
ALTER TABLE valuta
  ADD CONSTRAINT FK_valuta_RETE_WIFI FOREIGN KEY (rete_wifi) REFERENCES rete_wifi(id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_valuta_UTENTE FOREIGN KEY (utente) REFERENCES utente(id) ON DELETE CASCADE;

  
 --triggers
DELIMITER $$
 
CREATE TRIGGER `incrementa_segnalazione`
AFTER INSERT ON `segnalazione` 
FOR EACH ROW
BEGIN
UPDATE `rete_wifi` SET numero_segnalazioni = numero_segnalazioni +1 
WHERE `id` = NEW.rete_wifi;
END$$

CREATE TRIGGER `incrementa_valutazione`
AFTER INSERT ON `valuta` 
FOR EACH ROW
BEGIN
UPDATE `rete_wifi` SET numero_recensioni= numero_recensioni +1 
WHERE `id` = NEW.rete_wifi;
END$$

DELIMITER ;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
