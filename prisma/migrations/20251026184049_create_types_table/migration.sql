/*
  Warnings:

  - You are about to drop the column `type` on the `pokemons` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "types" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "types_on_pokemons" (
    "pokemon_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,

    PRIMARY KEY ("pokemon_id", "type_id"),
    CONSTRAINT "types_on_pokemons_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "types_on_pokemons_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pokemons" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_pokemons" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "pokemons";
DROP TABLE "pokemons";
ALTER TABLE "new_pokemons" RENAME TO "pokemons";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "types_name_key" ON "types"("name");
