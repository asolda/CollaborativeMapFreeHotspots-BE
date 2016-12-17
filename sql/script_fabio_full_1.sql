-- Script generante la struttura del DB e popola le tabelle utenti e reti wifi (senza segnalazioni e sessioni attive).

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Creazione DB (IMPORTANTE: cambiare gopher_main in gopher_test1 ecc. per testare su un DB diverso!)
DROP DATABASE IF EXISTS gopher_main;
CREATE DATABASE gopher_main DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE gopher_main;



-- Creazione tabella utenti
DROP TABLE IF EXISTS utente;
CREATE TABLE utente (
  id int(11) NOT NULL,
  email varchar(30) NOT NULL,
  password varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creazione tabella rete WiFi
DROP TABLE IF EXISTS rete_wifi;
CREATE TABLE rete_wifi (
  id int(11) NOT NULL,
  ssid varchar(30) NOT NULL,
  qualità float NOT NULL,
  latitudine double NOT NULL,
  longitudine double NOT NULL,
  numero_recensioni int(11) DEFAULT '0',
  necessità_login tinyint(1) DEFAULT '0',
  restrizioni text,
  altre_informazioni text,
  range_wifi int(11) NOT NULL DEFAULT '0',
  numero_segnalazioni int(11) DEFAULT '0',
  utente int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creazione tabella segnalazione
DROP TABLE IF EXISTS segnalazione;
CREATE TABLE segnalazione (
  utente int(11) NOT NULL,
  rete_wifi int(11) NOT NULL,
  tipo int(11) NOT NULL,
  dettagli text NOT NULL,
  visualizzato tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creazione tabella valutazione
CREATE TABLE valutazione (
  utente int(11) NOT NULL,
  rete_wifi int(11) NOT NULL,
  voto int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Creazione tabella sessioni
DROP TABLE IF EXISTS sessione;
CREATE TABLE sessione (
  session_id char(32) NOT NULL,
  user_agent varchar(30) NOT NULL,
  indirizzo_ip varchar(15) NOT NULL,
  ultimo_accesso date NOT NULL,
  utente int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;











-- Chiave primaria per rete_WiFi + chiave esterna
ALTER TABLE rete_wifi
  ADD PRIMARY KEY (id),
  ADD KEY FK_rete_wifi_UTENTE (utente);

-- Chiavi primarie per segnalazione + chiavi esterne
ALTER TABLE segnalazione
  ADD PRIMARY KEY (utente,rete_wifi,tipo),
  ADD KEY FK_segnalazione_RETE_WIFI (utente) USING BTREE,
  ADD KEY FK_segnalazione_UTENTE (rete_wifi) USING BTREE;

-- Chiave primaria per la tabella sessione + chiave esterna
ALTER TABLE sessione
  ADD PRIMARY KEY (session_id),
  ADD KEY FK_sessione_UTENTE (utente);

-- Chiave primaria per la tabella utente
ALTER TABLE utente
  ADD PRIMARY KEY (id);
  
-- Chiavi primarie per valutazione + chiavi esterne
ALTER TABLE valutazione
  ADD PRIMARY KEY (utente,rete_wifi),
  ADD KEY FK_valutazione_RETE_WIFI (utente) USING BTREE,
  ADD KEY FK_valutazione_UTENTE (rete_wifi) USING BTREE;

  
  
  
  
  
-- Settaggio degli AUTO_INCREMENT (IMPORTANTE: per ogni clone di questo script popolato va fixato in base al numero di righe nelle tabelle)
ALTER TABLE rete_wifi
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE utente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
  
  
  

  

-- Vincoli relazionali
ALTER TABLE rete_wifi
  ADD CONSTRAINT FK_rete_wifi_UTENTE FOREIGN KEY (utente) REFERENCES utente(id); 
  
ALTER TABLE segnalazione
  ADD CONSTRAINT FK_segnalazione_RETE_WIFI FOREIGN KEY (rete_wifi) REFERENCES rete_wifi(id),
  ADD CONSTRAINT FK_segnalazione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id);

ALTER TABLE sessione
  ADD CONSTRAINT FK_sessione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id);
  
ALTER TABLE valutazione
  ADD CONSTRAINT FK_valutazione_RETE_WIFI FOREIGN KEY (rete_wifi) REFERENCES rete_wifi(id),
  ADD CONSTRAINT FK_valutazione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id);



  
  
  
  
-- Query di popolazione
INSERT INTO utente (id, email, password) VALUES
(1, 'asolda92@gmail.com', '74583a72809d2c308518ceaa966047d97c261f54'),
(2, 'finalgalaxy@gmail.com', 'e842a311179ec6cd39a674ea85529c0e6aad8002'),
(3, 'cesaretucci95@gmail.com', '5fb0076337e0df3de0e7162d3bcf9788e3b9758d'),
(4, 'gianluca17@gmail.com', '4188736a00fbfb506aca06281acf338290455c21'),
(5, 'james1@gmail.com', '4188736a00fbfb506aca06281acf338290455c21'),
(6, 'rubinho@gmail.com', '4188736a00fbfb506aca06281acf338290455c21'),
(7, 'vayumees@gmail.com', '4188736a00fbfb506aca06281acf338290455c21'),
(8, 'mathewalter2@gmail.com', '4188736a00fbfb506aca06281acf338290455c21'),
(9, 'amhad10@gmail.com', '4188736a00fbfb506aca06281acf338290455c21');

INSERT INTO rete_wifi (id, ssid, qualità, latitudine, longitudine, numero_recensioni, necessità_login, restrizioni, altre_informazioni, range_wifi, numero_segnalazioni, utente) VALUES
(1, 'tp-link', 4, 40.775132, 14.789021, 0, 0, 'Range di indirizzi IP limitato.\r\nBanda up/down inferiore alla media dei piani ADSL comuni.', 'Velocità media download: 1Mbit/s\r\nVelocità media upload: 10Kb/s', 50, 0, 2),
(2, 'Docenti', 5, 40.772143, 14.788932, 0, 1, 'Traffico controllato dagli amministratori di rete.', 'Velocità media download: 5Mbit/s.\r\n\r\nPer il login alla rete pubblica sono richieste credenziali specifiche, contattare la segreteria.', 750, 0, 1),
(3, 'Studenti', 2, 40.772221, 14.790845, 0, 1, 'Traffico controllato dagli amministratori di rete.', 'Velocità media download: 3Mbit/s.\r\n\r\nLa rete ha un timeout di 2 minuti di inattività.', 750, 0, 1),
(4, 'TISCALI', 3, 40.773256, 14.789099, 0, 0, 'Torrent non permessi.', 'Operativa in media dalle 8:00 alle 20:00.', 20, 0, 4),
(5, 'linksys', 4, 40.770219, 14.791901, 0, 0, '', 'Supporta 5ghz.', 20, 0, 4),
(6, 'TISCALI', 3, 40.773163, 14.788662, 0, 0, NULL, NULL, 30, 0, 5),
(7, 'Vodafone-12345678', 2, 40.772452, 14.788941, 0, 0, NULL, NULL, 35, 0, 5),
(8, 'Vodafone-28920868', 4, 40.772107, 14.789928, 0, 0, NULL, 'Supporta 5ghz.', 35, 0, 5);