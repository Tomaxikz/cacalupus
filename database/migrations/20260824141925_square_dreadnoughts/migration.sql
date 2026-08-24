INSERT INTO "user_settings" (
  "user_uuid",
  "settings"
)
SELECT
  "uuid",
  (
    CASE
      WHEN "toast_position" <> 'BOTTOM_RIGHT'
      THEN jsonb_build_object('app::toast_position', lower("toast_position"::text))
      ELSE '{}'::jsonb
    END
    ||
    CASE
      WHEN "start_on_grouped_servers"
      THEN jsonb_build_object('dashboard::start_on_grouped_servers', true)
      ELSE '{}'::jsonb
    END
  )
FROM "users"
WHERE "toast_position" <> 'BOTTOM_RIGHT' OR "start_on_grouped_servers"
ON CONFLICT ("user_uuid") DO UPDATE SET "settings" = "user_settings"."settings" || EXCLUDED."settings";

ALTER TABLE "users" DROP COLUMN "toast_position";
ALTER TABLE "users" DROP COLUMN "start_on_grouped_servers";
DROP TYPE "user_toast_position";
