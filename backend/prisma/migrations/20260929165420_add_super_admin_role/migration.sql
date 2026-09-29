-- CreateEnum
CREATE TYPE "FacultyRole" AS ENUM ('FACULTY', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "FacultyMember" ADD COLUMN     "role" "FacultyRole" NOT NULL DEFAULT 'FACULTY';
