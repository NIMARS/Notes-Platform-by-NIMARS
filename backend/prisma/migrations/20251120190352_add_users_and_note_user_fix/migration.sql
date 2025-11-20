/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uidx_notes_id_userId" ON "Note"("id", "userId");
