import { createClient } from "npm:@supabase/supabase-js@2";

// Admin tools for admin-users.html and admin-support.html. Every action first checks the database's
// admin allowlist (get_admin_analytics) with the caller's own token, then uses the service role.

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://gymplified.com",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

// Which Stripe mode a key belongs to. Key values never leave the server.
function stripeMode(key: string) { return /^(sk|rk)_live_/.test(key) ? "live" : /^(sk|rk)_test_/.test(key) ? "test" : null; }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const origin = req.headers.get("origin") || "";
  if (origin && !["https://gymplified.com", "https://www.gymplified.com"].includes(origin)) {
    return json({ error: "Origin not allowed" }, 403);
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Sign in required" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ||
      JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}").default;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default;
    if (!url || !anonKey || !serviceKey) return json({ error: "Server admin configuration is incomplete" }, 500);

    const userClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: "Bearer " + token } } });
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Your session is invalid. Please sign in again." }, 401);
    if (!authData.user.email_confirmed_at) return json({ error: "Please verify your email address before accessing admin tools." }, 403);

    // Reuse the database's existing allowlist check. It is the source of truth for admin access.
    const { error: permissionError } = await userClient.rpc("get_admin_analytics", { days_back: 1 });
    if (permissionError) return json({ error: "You are not authorised to manage Gymplified accounts." }, 403);

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json();
    const action = String(body.action || "");

    if (action === "list_tickets") {
      const status = String(body.status || "all");
      const search = String(body.search || "").trim().toLowerCase().slice(0, 120);
      const page = Math.max(1, Math.min(10000, Number(body.page) || 1));
      const perPage = Math.max(10, Math.min(100, Number(body.perPage) || 50));
      let query = admin.from("support_tickets").select("id,user_id,email,subject,category,status,created_at,updated_at,last_message_at", { count: "exact" }).order("last_message_at", { ascending: false });
      if (status !== "all") query = query.eq("status", status);
      if (search) query = query.or("email.ilike.%"+search+"%,subject.ilike.%"+search+"%");
      const { data, error, count } = await query.range((page-1)*perPage, page*perPage-1);
      if (error) throw error;
      return json({ tickets: data || [], total: count || 0, page, perPage });
    }

    if (action === "get_ticket") {
      const id = String(body.ticket_id || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid ticket ID" }, 400);
      const [{ data: ticket, error: ticketError }, { data: messages, error: messagesError }] = await Promise.all([
        admin.from("support_tickets").select("*").eq("id", id).maybeSingle(),
        admin.from("support_ticket_messages").select("id,ticket_id,user_id,author_role,message,created_at").eq("ticket_id", id).order("created_at", { ascending: true })
      ]);
      if (ticketError) throw ticketError;
      if (messagesError) throw messagesError;
      if (!ticket) return json({ error: "Ticket not found" }, 404);
      return json({ ticket, messages: messages || [] });
    }

    if (action === "reply_ticket") {
      const id = String(body.ticket_id || "");
      const message = String(body.message || "").trim();
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid ticket ID" }, 400);
      if (message.length < 2 || message.length > 5000) return json({ error: "Reply must be between 2 and 5000 characters" }, 400);
      const { data: ticket, error: ticketError } = await admin.from("support_tickets").select("id,status").eq("id", id).maybeSingle();
      if (ticketError) throw ticketError;
      if (!ticket) return json({ error: "Ticket not found" }, 404);
      const nextStatus = String(body.status || "waiting_on_user");
      if (!["open", "in_progress", "waiting_on_user", "resolved"].includes(nextStatus)) return json({ error: "Invalid ticket status" }, 400);
      const { error: messageError } = await admin.from("support_ticket_messages").insert({ ticket_id: id, user_id: authData.user.id, author_role: "admin", message });
      if (messageError) throw messageError;
      const { error: updateError } = await admin.from("support_tickets").update({ status: nextStatus, updated_at: new Date().toISOString() }).eq("id", id);
      if (updateError) throw updateError;
      return json({ ok: true, status: nextStatus });
    }

    if (action === "update_ticket_status") {
      const id = String(body.ticket_id || "");
      const status = String(body.status || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid ticket ID" }, 400);
      if (!["open", "in_progress", "waiting_on_user", "resolved"].includes(status)) return json({ error: "Invalid ticket status" }, 400);
      const { error } = await admin.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      return json({ ok: true, status });
    }

    if (action === "list_users") {
      const search = String(body.search || "").trim().toLowerCase().slice(0, 120);
      const page = Math.max(1, Math.min(10000, Number(body.page) || 1));
      const perPage = Math.max(10, Math.min(100, Number(body.perPage) || 50));
      const allUsers: any[] = [];
      for (let p = 1; p <= 50; p++) {
        const { data, error } = await admin.auth.admin.listUsers({ page: p, perPage: 1000 });
        if (error) throw error;
        const batch = data.users || [];
        allUsers.push(...batch);
        if (batch.length < 1000) break;
      }
      const ids = allUsers.map(u => u.id);
      const [profilesResult, statesResult, deluxeResult] = ids.length ? await Promise.all([
        admin.from("profiles").select("id,username,display_name,avatar_url,created_at").in("id", ids),
        admin.from("user_app_state").select("user_id,state,updated_at").in("user_id", ids),
        admin.from("deluxe_entitlements").select("user_id").is("revoked_at", null),
      ]) : [{ data: [], error: null }, { data: [], error: null }, { data: [], error: null }];
      if (profilesResult.error) throw profilesResult.error;
      if (statesResult.error) throw statesResult.error;
      if (deluxeResult.error) throw deluxeResult.error;
      const profiles = new Map((profilesResult.data || []).map((p: any) => [p.id, p]));
      const states = new Map((statesResult.data || []).map((s: any) => [s.user_id, s]));
      const deluxeIds = new Set((deluxeResult.data || []).map((d: any) => d.user_id));
      const filtered = allUsers.filter(u => {
        if (!search) return true;
        const p: any = profiles.get(u.id) || {};
        return [u.email, p.username, p.display_name, u.id].some(v => String(v || "").toLowerCase().includes(search));
      });
      const users = filtered.slice((page - 1) * perPage, page * perPage).map(u => {
        const p: any = profiles.get(u.id) || {};
        const stored: any = states.get(u.id) || {};
        const state: any = stored.state || {};
        const game = state.game || {};
        return {
          id: u.id, email: u.email || "", created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at || null, banned_until: u.banned_until || null,
          username: p.username || "", display_name: p.display_name || "",
          avatar_url: p.avatar_url || null, progress_updated_at: stored.updated_at || null,
          workouts: Array.isArray(state.sessions) ? state.sessions.length : 0,
          personal_records: Array.isArray(state.prs) ? state.prs.length : 0,
          xp: Number(game.xp) || 0, streak: Number(game.streak) || 0,
          deluxe: deluxeIds.has(u.id),
        };
      });
      const bannedCount = allUsers.filter(u => u.banned_until && new Date(u.banned_until) > new Date()).length;
      return json({ users, total: filtered.length, page, perPage, totalAccounts: allUsers.length, bannedCount, deluxeCount: deluxeIds.size });
    }

    if (action === "get_user") {
      const id = String(body.user_id || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid user ID" }, 400);
      const [{ data: userData, error: userError }, { data: profile, error: profileError }, { data: stored, error: stateError }, { data: entitlement, error: deluxeError }] = await Promise.all([
        admin.auth.admin.getUserById(id),
        admin.from("profiles").select("id,username,display_name,avatar_url,created_at").eq("id", id).maybeSingle(),
        admin.from("user_app_state").select("state,updated_at").eq("user_id", id).maybeSingle(),
        admin.from("deluxe_entitlements").select("source,granted_at,revoked_at,stripe_payment_intent,changed_at,amount_total,currency").eq("user_id", id).maybeSingle(),
      ]);
      if (userError) throw userError;
      if (profileError) throw profileError;
      if (stateError) throw stateError;
      if (deluxeError) throw deluxeError;
      return json({
        user: { id: userData.user.id, email: userData.user.email || "", created_at: userData.user.created_at, last_sign_in_at: userData.user.last_sign_in_at || null, banned_until: userData.user.banned_until || null },
        profile: profile || {},
        state: stored?.state || {},
        progress_updated_at: stored?.updated_at || null,
        deluxe: {
          deluxe: !!entitlement && !entitlement.revoked_at,
          source: entitlement?.source || null,
          granted_at: entitlement?.granted_at || null,
          revoked_at: entitlement?.revoked_at || null,
          paid: !!entitlement?.stripe_payment_intent,
          payment_intent: entitlement?.stripe_payment_intent || null,
          amount_total: entitlement?.amount_total ?? null,
          currency: entitlement?.currency || null,
          stripe_mode: stripeMode(Deno.env.get("STRIPE_SECRET_KEY") || ""),
        },
      });
    }

    // Deluxe batch: is the payment setup complete? Reports yes/no and details only, never key values.
    if (action === "payment_health") {
      const key = Deno.env.get("STRIPE_SECRET_KEY") || "", priceId = Deno.env.get("STRIPE_PRICE_DELUXE") || "", whsec = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
      const mode = stripeMode(key), managed = Deno.env.get("STRIPE_MANAGED_PAYMENTS") !== "0";
      const checks: { id: string; ok: boolean; label: string; detail: string }[] = [];
      checks.push({ id: "key", ok: !!mode, label: "Stripe key", detail: mode === "live" ? "Live key: real payments." : mode === "test" ? "Test (sandbox) key: no real money is taken." : "Missing, or not a Stripe secret/restricted key." });
      let price: any = null, priceError = "";
      if (mode && /^price_[A-Za-z0-9]+$/.test(priceId)) {
        try {
          const res = await fetch("https://api.stripe.com/v1/prices/" + priceId + "?expand[]=product", { headers: { Authorization: "Bearer " + key } });
          const data = await res.json();
          if (!res.ok) priceError = (data && data.error && data.error.message) || "Stripe refused the request.";
          else price = data;
        } catch (_) { priceError = "Could not reach Stripe."; }
      }
      const priceOk = !!price && price.active && price.type === "one_time" && price.livemode === (mode === "live");
      checks.push({ id: "price", ok: priceOk, label: "Deluxe price", detail: !priceId ? "STRIPE_PRICE_DELUXE is not set." : priceError ? priceError : !price ? "Not checked (needs a valid key)." :
        (price.livemode !== (mode === "live") ? "This price is from the " + (price.livemode ? "live" : "test") + " account, but the key is " + mode + "." :
        !price.active ? "The price is archived." : price.type !== "one_time" ? "The price is recurring; Deluxe should be one-time." :
        "One-time " + (price.unit_amount / 100).toFixed(2) + " " + String(price.currency).toUpperCase() + " · " + ((price.product && price.product.name) || "product")) });
      const taxCode = price && price.product && price.product.tax_code ? (typeof price.product.tax_code === "string" ? price.product.tax_code : price.product.tax_code.id) : "";
      checks.push({ id: "tax", ok: !managed || !!taxCode, label: "Product tax code", detail: taxCode ? taxCode : managed ? "Missing: Managed Payments needs a digital-product tax code on the product." : "Not required without Managed Payments." });
      checks.push({ id: "webhook", ok: /^whsec_/.test(whsec), label: "Webhook signing secret", detail: /^whsec_/.test(whsec) ? "Saved. Check recent deliveries show 200 in Stripe → Developers → Webhooks." : "STRIPE_WEBHOOK_SECRET is missing, so payments would not unlock Deluxe." });
      checks.push({ id: "managed", ok: true, label: "Managed Payments", detail: managed ? "On: Stripe handles VAT, receipts and refunds rules." : "Off: you are responsible for tax (STRIPE_MANAGED_PAYMENTS=0)." });
      const { data: ents, error: entError } = await admin.from("deluxe_entitlements").select("source,revoked_at");
      if (entError) throw entError;
      const active = (ents || []).filter((e: any) => !e.revoked_at);
      return json({ mode, ready: checks.every(c => c.ok), checks, counts: { active: active.length, paid: active.filter((e: any) => e.source !== "admin").length, gifted: active.filter((e: any) => e.source === "admin").length, revoked: (ents || []).length - active.length } });
    }

    if (action === "set_deluxe") {
      const id = String(body.user_id || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid user ID" }, 400);
      if (typeof body.on !== "boolean") return json({ error: "Choose whether Deluxe is on or off" }, 400);
      const { data, error } = await admin.rpc("gymplified_admin_set_deluxe", { p_user: id, p_on: body.on, p_admin: authData.user.id });
      if (error) throw error;
      return json({ ok: true, deluxe: data });
    }

    if (action === "set_ban") {
      const id = String(body.user_id || "");
      const duration = String(body.duration || "");
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid user ID" }, 400);
      if (!["none", "24h", "7d", "30d", "876000h"].includes(duration)) return json({ error: "Invalid ban duration" }, 400);
      const { data, error } = await admin.auth.admin.updateUserById(id, { ban_duration: duration });
      if (error) throw error;
      return json({ ok: true, banned_until: data.user?.banned_until || null });
    }

    if (action === "save_progress") {
      const id = String(body.user_id || "");
      const state = body.state;
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid user ID" }, 400);
      if (!state || typeof state !== "object" || Array.isArray(state)) return json({ error: "Progress must be a JSON object" }, 400);
      if (JSON.stringify(state).length > 900000) return json({ error: "Progress data is too large" }, 413);
      const { error } = await admin.from("user_app_state").upsert({ user_id: id, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (error) throw error;
      return json({ ok: true, updated_at: new Date().toISOString() });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("gymplified-admin-users:", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected server error" }, 500);
  }
});
