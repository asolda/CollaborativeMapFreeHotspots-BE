SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Creazione DB (IMPORTANTE: cambiare gopher_main in gopher_test1 ecc. per testare su un DB diverso!)
DROP DATABASE IF EXISTS gopher_main;
CREATE DATABASE gopher_main DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE gopher_main;




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

-- Creazione tabella sessioni
DROP TABLE IF EXISTS sessione;
CREATE TABLE sessione (
  session_id char(32) NOT NULL,
  user_agent varchar(30) NOT NULL,
  indirizzo_ip varchar(15) NOT NULL,
  ultimo_accesso date NOT NULL,
  utente int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creazione tabella utenti
DROP TABLE IF EXISTS utente;
CREATE TABLE utente (
  id int(11) NOT NULL,
  email varchar(30) NOT NULL,
  password varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;






-- Chiave primaria per rete_WiFi
ALTER TABLE rete_wifi
  ADD PRIMARY KEY (id);

-- Chiavi primarie per segnalazione
ALTER TABLE segnalazione
  ADD PRIMARY KEY (utente,rete_wifi),
  ADD UNIQUE KEY FK_segnalazione_RETE_WIFI (utente),
  ADD UNIQUE KEY FK_segnalazione_UTENTE (rete_wifi);

-- Chiave primaria per la tabella sessione
ALTER TABLE sessione
  ADD PRIMARY KEY (session_id);

-- Chiave primaria per la tabella utente
ALTER TABLE utente
  ADD PRIMARY KEY (id);

  
  
  
  
  
-- Settaggio degli AUTO_INCREMENT
ALTER TABLE rete_wifi
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE utente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
  
  
  

  

-- Vincoli relazionali
ALTER TABLE rete_wifi
  ADD CONSTRAINT FK_rete_wifi_UTENTE FOREIGN KEY (utente) REFERENCES utente(id); 
  
ALTER TABLE segnalazione
  ADD CONSTRAINT FK_segnalazione_RETE_WIFI FOREIGN KEY (rete_wifi) REFERENCES rete_wifi(id),
  ADD CONSTRAINT FK_segnalazione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id);

ALTER TABLE sessione
  ADD CONSTRAINT FK_sessione_UTENTE FOREIGN KEY (utente) REFERENCES utente(id);
