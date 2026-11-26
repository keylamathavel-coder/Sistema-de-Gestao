CREATE DATABASE IF NOT EXISTS Sistema_de_Gestãoo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE Sistema_de_Gestãoo;

CREATE TABLE IF NOT EXISTS Lista_Equipamentos (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    serie VARCHAR(100) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    utilizador VARCHAR(100) NOT NULL DEFAULT '',
    data_aquisicao DATE NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_garantia DATE NULL DEFAULT NULL,
    estado VARCHAR(30) NOT NULL,
    data_abate DATE NULL DEFAULT NULL,
    observacoes VARCHAR(300) NOT NULL DEFAULT '',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY codigo (codigo),
    UNIQUE KEY serie (serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;