# Gymplified auth emails

Branded versions of the emails Supabase Auth sends. Supabase reads them from the dashboard, not from this
folder, so after changing a file here, paste it in again.

| File | Dashboard template | Subject |
| --- | --- | --- |
| `confirmation.html` | Authentication → Emails → Templates → **Confirm signup** | `Confirm your Gymplified account` |
| `reset-password.html` | Authentication → Emails → Templates → **Reset password** | `Reset your Gymplified password` |

The app sends the sign-up confirmation (and its "Resend" button) and the password reset: "Forgot your
password?" on the Log in form emails the reset link, and the link opens the app on a "Choose a new password"
dialog. Signed-in members change a password they know under Account → Sync & security.

## Make the email come from Gymplified
The sender name and address are not part of the templates. They come from custom SMTP:
1. Verify `gymplified.com` with an email provider (for example Resend, Postmark, Brevo or Amazon SES) by adding
   the SPF, DKIM and DMARC DNS records it gives you.
2. In Authentication → Emails → SMTP Settings, turn on custom SMTP with sender email `noreply@gymplified.com`,
   sender name `Gymplified`, and the provider's host, port, username and password.
3. Sign up with a fresh address and check the From line, the design, and that the button lands on gymplified.com.

## Notes
- Placeholders: `{{ .ConfirmationURL }}` is the one-time link and `{{ .Email }}` the recipient. Keep them exactly.
- Styles are inline and the layout uses tables because many email apps strip `<style>` blocks.
- The logo loads from `https://gymplified.com/gymplified-app-icon.jpg`, so keep that file published.
- The button lands where Authentication → URL Configuration allows: set Site URL to `https://gymplified.com`
  and add `https://gymplified.com/**` and `https://www.gymplified.com/**` to Redirect URLs.
- The reset link must come back to the app with `type=recovery` in the address, which is what
  `{{ .ConfirmationURL }}` does. If the redirect URL is not on the list above, Supabase sends people to the
  Site URL instead, and the new-password dialog still opens there.
- Reset emails are rate limited by Supabase (one per address per minute by default, plus the project's hourly
  email limit under Authentication → Rate Limits). The app shows a plain "wait a minute" message when that hits.
