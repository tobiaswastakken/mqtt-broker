CREATE TABLE `cargar` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(10) NOT NULL,
  `humedad` int(10) NOT NULL,
  `temperatura` int(10) NOT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

