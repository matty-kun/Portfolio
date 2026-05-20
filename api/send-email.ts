export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { email, projectType, business, inquiryId } = body;

    if (!email || !projectType || !business || !inquiryId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: RESEND_API_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brief Received - Matthew Vargas</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;max-width:560px;width:100%;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#9ca3af;text-transform:uppercase;">Matthew Vargas</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#111111;letter-spacing:-0.02em;">Brief Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.6;">
                Hey there, your project brief has been logged and is now sitting in my dashboard for review. I'll go through the details and get back to you shortly.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;margin:20px 0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#9ca3af;text-transform:uppercase;">Brief Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#9ca3af;width:120px;">Reference ID</td>
                        <td style="padding:4px 0;font-size:12px;color:#111111;font-weight:600;">${inquiryId}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#9ca3af;">Project Type</td>
                        <td style="padding:4px 0;font-size:12px;color:#111111;font-weight:600;">${projectType}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:12px;color:#9ca3af;">Business</td>
                        <td style="padding:4px 0;font-size:12px;color:#111111;font-weight:600;">${business}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                While you wait, you can secure your slot by booking a discovery call. We'll use it to nail down the scope, architecture, and timeline for your project.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 0 0;">
                <tr>
                  <td style="background:#111111;">
                    <a href="https://cal.com/matthewvargas" target="_blank"
                       style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.04em;white-space:nowrap;">
                      BOOK DISCOVERY CALL
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:12px;color:#d1d5db;line-height:1.5;">
                Or copy this link: <a href="https://cal.com/matthewvargas" style="color:#9ca3af;">https://cal.com/matthewvargas</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#d1d5db;line-height:1.5;">
                Matthew Vargas · Founder, Software Engineer and Architect<br>
                vargasjanmatthew867@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio/1.0',
      },
      body: JSON.stringify({
        from: 'Matthew Vargas <onboarding@resend.dev>',
        to: [email],
        subject: `Brief Received - ${inquiryId} | Matthew Vargas`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Resend API error' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
