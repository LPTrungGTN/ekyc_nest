/*
  Warnings:

  - You are about to drop the `CardInfomation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `CardInfomation`;

-- CreateTable
CREATE TABLE `Card_informations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_number` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NULL,
    `birthday` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `nationaliry` VARCHAR(191) NULL,
    `issue_date` VARCHAR(191) NULL,
    `expire_date` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
