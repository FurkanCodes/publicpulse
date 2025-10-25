ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS require_account_for_suggestions boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS max_public_suggestions_per_user integer NOT NULL DEFAULT 3;

ALTER TABLE community_suggestions
  ADD COLUMN IF NOT EXISTS submitted_by_user_id text REFERENCES "user"(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS community_suggestions_user_idx
  ON community_suggestions(company_id, submitted_by_user_id);
