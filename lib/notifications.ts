export type SuggestionNotificationPayload = {
  companyName: string;
  companySlug: string;
  title: string;
  description?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
};

export async function notifyNewSuggestion(
  payload: SuggestionNotificationPayload,
): Promise<void> {
  const webhook = process.env.SUGGESTION_WEBHOOK_URL;
  if (!webhook) {
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "community_suggestion.created",
        data: payload,
      }),
    });
  } catch (error) {
    console.error("[notifications] failed to send suggestion webhook", error);
  }
}
