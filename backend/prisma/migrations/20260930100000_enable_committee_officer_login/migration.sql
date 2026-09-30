UPDATE "FacultyMember" AS faculty
SET "canLogin" = TRUE
WHERE "password" IS NOT NULL
  AND (
    EXISTS (
      SELECT 1
      FROM "Committee" AS committee
      WHERE committee."chairmanId" = faculty."id"
    )
    OR EXISTS (
      SELECT 1
      FROM "Committee" AS committee
      WHERE committee."secretaryId" = faculty."id"
    )
  );