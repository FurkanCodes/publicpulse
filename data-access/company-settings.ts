import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  companySettings,
  type SelectCompanySettings,
} from "@/db/schema";

export async function getCompanySettings(
  companyId: string,
): Promise<SelectCompanySettings | undefined> {
  const result = await db
    .select()
    .from(companySettings)
    .where(eq(companySettings.companyId, companyId))
    .limit(1);

  return result[0];
}

type UpsertCompanySettingsInput = {
  enablePublicSuggestions?: boolean;
  requireAccountForSuggestions?: boolean;
  maxPublicSuggestionsPerUser?: number;
};

export async function upsertCompanySettings(
  companyId: string,
  updates: UpsertCompanySettingsInput,
): Promise<SelectCompanySettings> {
  const current = await getCompanySettings(companyId);

  const next = {
    enablePublicSuggestions:
      updates.enablePublicSuggestions ?? current?.enablePublicSuggestions ?? false,
    requireAccountForSuggestions:
      updates.requireAccountForSuggestions ?? current?.requireAccountForSuggestions ?? true,
    maxPublicSuggestionsPerUser:
      updates.maxPublicSuggestionsPerUser ?? current?.maxPublicSuggestionsPerUser ?? 3,
  };

  const [settings] = await db
    .insert(companySettings)
    .values({
      companyId,
      ...next,
    })
    .onConflictDoUpdate({
      target: companySettings.companyId,
      set: {
        ...next,
        updatedAt: new Date(),
      },
    })
    .returning();

  return settings;
}
