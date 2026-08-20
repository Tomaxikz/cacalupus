DELETE FROM "user_password_resets";
ALTER TABLE "user_password_resets" ADD COLUMN "token_start" char(16) NOT NULL;
CREATE INDEX "user_password_resets_token_start_idx" ON "user_password_resets" ("token_start");
