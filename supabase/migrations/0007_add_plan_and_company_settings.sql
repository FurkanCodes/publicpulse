ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS allow_public_suggestions boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS company_settings (
  company_id uuid PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  enable_public_suggestions boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
