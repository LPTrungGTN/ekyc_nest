-- CreateTable
CREATE TABLE `Card_informations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `id_number` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NULL,
    `birthday` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `issue_date` VARCHAR(191) NULL,
    `expire_date` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
