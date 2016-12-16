-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Dic 16, 2016 alle 10:59
-- Versione del server: 5.7.11
-- Versione PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: gopher_main
--
DROP DATABASE IF EXISTS gopher_main;
CREATE DATABASE gopher_main DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE gopher_main;

-- --------------------------------------------------------

--
-- Struttura della tabella rete_wifi
--

DROP TABLE IF EXISTS rete_wifi;
CREATE TABLE rete_wifi (
  id int(11) NOT NULL,
  ssid varchar(30) NOT NULL,
  qualità float NOT NULL,
  latitudine float NOT NULL,
  longitudine float NOT NULL,
  numero_recensioni int(11) DEFAULT '0',
  necessità_login tinyint(1) DEFAULT '0',
  restrizioni text,
  altre_informazioni text,
  range_wifi int(11) NOT NULL DEFAULT '0',
  numero_segnalazioni int(11) DEFAULT '0',
  utente int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella segnalazione
--

DROP TABLE IF EXISTS segnalazione;
CREATE TABLE segnalazione (
  utente int(11) NOT NULL,
  rete_wifi int(11) NOT NULL,
  tipo int(11) NOT NULL,
  dettagli text NOT NULL,
  visualizzato tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella sessione
--

DROP TABLE IF EXISTS sessione;
CREATE TABLE sessione (
  session_id char(32) NOT NULL,
  user_agent varchar(30) NOT NULL,
  indirizzo_ip varchar(15) NOT NULL,
  ultimo_accesso date NOT NULL,
  utente int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella utente
--

DROP TABLE IF EXISTS utente;
CREATE TABLE utente (
  id int(11) NOT NULL,
  email varchar(30) NOT NULL,
  password varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle rete_wifi
--
ALTER TABLE rete_wifi
  ADD PRIMARY KEY (id),
  ADD KEY FK_UTENTE (utente);

--
-- Indici per le tabelle segnalazione
--
ALTER TABLE segnalazione
  ADD PRIMARY KEY (utente,rete_wifi),
  ADD UNIQUE KEY FK_utente1 (utente),
  ADD UNIQUE KEY FK_rete_wifi (rete_wifi);

--
-- Indici per le tabelle sessione
--
ALTER TABLE sessione
  ADD PRIMARY KEY (session_id),
  ADD KEY FK_utente2 (utente);

--
-- Indici per le tabelle utente
--
ALTER TABLE utente
  ADD PRIMARY KEY (id);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella rete_wifi
--
ALTER TABLE rete_wifi
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella utente
--
ALTER TABLE utente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella segnalazione
--
ALTER TABLE segnalazione
  ADD CONSTRAINT FK_rete_wifi FOREIGN KEY (rete_wifi) REFERENCES rete_wifi (id),
  ADD CONSTRAINT FK_utente1 FOREIGN KEY (utente) REFERENCES utente (id);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
