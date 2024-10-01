CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(10) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cliente_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `paymentIntent` VARCHAR(191) NOT NULL,
    `status` VARCHAR(10) NOT NULL,
    `customerData` JSON NOT NULL,
    `numeroAsistentes` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `inicio` DATETIME(3) NOT NULL,
    `finalizacion` DATETIME(3) NOT NULL,
    `total` DOUBLE NOT NULL,
    `refund` DOUBLE,
    `emailStatus` TINYINT(1) DEFAULT 0,

    INDEX `Reserva_clienteId_idx`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE customer_auth (
    token VARCHAR(255) PRIMARY KEY,
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Cliente(id) ON DELETE CASCADE
);
