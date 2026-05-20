import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, name, projectType, business, inquiryId } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brief Received — Matthew Vargas</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #1e1e1e;border-radius:4px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#6b7280;text-transform:uppercase;">Matthew Vargas</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Brief Received ✦</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:14px;color:#9ca3af;line-height:1.6;">
                Hey there — your project brief has been logged and is now sitting in my dashboard for review. I'll go through the details and get back to you shortly.
              </p>

              <!-- Brief Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:3px;margin:20px 0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#6b7280;text-transform:uppercase;">Brief Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#6b7280;width:120px;">Reference ID</td>
                        <td style="padding:4px 0;font-size:12px;color:#e5e7eb;font-weight:600;">${inquiryId}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#6b7280;">Project Type</td>
                        <td style="padding:4px 0;font-size:12px;color:#e5e7eb;font-weight:600;">${projectType}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#6b7280;">Business</td>
                        <td style="padding:4px 0;font-size:12px;color:#e5e7eb;font-weight:600;">${business}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">
                While you wait, you can secure your slot by booking a discovery call. We'll use it to nail down the scope, architecture, and timeline for your project.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 0 0;">
                <tr>
                  <td style="background:#ffffff;border-radius:3px;">
                    <a href="https://cal.com/matthewvargas"
                       target="_blank"
                       style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#000000;text-decoration:none;letter-spacing:0.04em;white-space:nowrap;">
                      📅 BOOK DISCOVERY CALL →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:12px;color:#4b5563;line-height:1.5;">
                Or copy this link: <a href="https://cal.com/matthewvargas" style="color:#9ca3af;">https://cal.com/matthewvargas</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #1e1e1e;">
              <p style="margin:0;font-size:11px;color:#374151;line-height:1.5;">
                Matthew Vargas · Founder / Software Engineer / Architect<br>
                vargasjanmatthew867@gmail.com · <a href="https://matthewvargas.dev" style="color:#4b5563;text-decoration:none;">matthewvargas.dev</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Matthew Vargas <onboarding@resend.dev>',
        to: [email],
        subject: `Brief Received — ${inquiryId} · Matthew Vargas`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
