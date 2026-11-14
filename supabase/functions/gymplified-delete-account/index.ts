import { createClient } from "npm:@supabase/supabase-js@2";

// Self-service account erasure ("right to be forgotten", GDPR Art. 17).
// Deploy with JWT verification ON. Database rows owned by the user are removed by
// ON DELETE CASCADE from auth.users (profiles, user_app_state, support_tickets and
// their messages, friend_requests, friend_activity_reactions, deluxe_entitlements).
// Avatar files and analytics rows are not covered by a cascade, so they are erased here.

const ALLOWED_ORIGINS = ["https://gymplified.com", "https://www.gymplified.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://gymplified.com",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: "Origin not allowed" }, 403);

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Sign in required" }, 401);

    const body = await req.json().catch(() => ({}));
    if (body.confirmation !== "DELETE") return json({ error: "Explicit DELETE confirmation is required" }, 400);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ||
      JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}").default;
    const secretKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default;
    if (!url || !anonKey || !secretKey) return json({ error: "Server account-deletion configuration is incomplete" }, 500);

    const userClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: "Bearer " + token } },
    });
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Your session is invalid. Please sign in again." }, 401);
    if (!authData.user.email_confirmed_at) return json({ error: "Verify your email before deleting your account." }, 403);

    const userId = authData.user.id;
    const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });

    // Remove owned avatar objects before deleting the Auth user; Storage ownership can block user deletion.
    const { data: objects, error: listError } = await admin.storage.from("avatars").list(userId, { limit: 100 });
    if (listError) throw listError;
    const paths = (objects || []).filter((o: { name?: string }) => o && o.name).map((o: { name: string }) => userId + "/" + o.name);
    if (paths.length) {
      const { error: removeError } = await admin.storage.from("avatars").remove(paths);
      if (removeError) throw removeError;
    }

    // Analytics rows use SET NULL on user deletion, so explicitly erase any linked to the account.
    const { error: analyticsError } = await admin.from("analytics_events").delete().eq("user_id", userId);
    if (analyticsError) throw analyticsError;

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return json({ ok: true, message: "Your Gymplified account and associated account data have been deleted." });
  } catch (error) {
    console.error("gymplified-delete-account:", error);
    return json({ error: "Could not delete your account. Please contact support." }, 500);
  }
});
