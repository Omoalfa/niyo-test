/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,time]` on the table `Tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tasks_name_userId_time_key" ON "Tasks"("name", "userId", "time");
