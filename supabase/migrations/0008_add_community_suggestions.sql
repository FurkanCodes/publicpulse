CREATE TABLE IF NOT EXISTS community_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  submitter_name text,
  submitter_email text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  moderated_at timestamp with time zone,
  moderated_by text REFERENCES "user"(id) ON DELETE SET NULL,
  resolution_note text
);

CREATE INDEX IF NOT EXISTS community_suggestions_company_id_idx
  ON community_suggestions(company_id);
