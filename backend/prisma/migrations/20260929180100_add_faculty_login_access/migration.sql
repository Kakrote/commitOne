-- AlterTable
ALTER TABLE "FacultyMember" ADD COLUMN     "canLogin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
