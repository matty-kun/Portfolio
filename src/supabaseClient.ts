import { createClient } from '@supabase/supabase-js';

// Get environment variables with type safety and fallback check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if Supabase is properly configured
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');

// Initialize client if configured, otherwise export null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Robust Database Service with Seamless LocalStorage fallback
 */
export const dbService = {
  /**
   * Fetch all inquiries
   */
  async getInquiries(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          email: item.email,
          business: item.business,
          type: item.type,
          teamSize: item.team_size,
          budget: item.budget,
          contact: item.contact,
          status: item.status,
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        }));
      }
      console.warn("Supabase select error, falling back to LocalStorage:", error);
    }
    
    // Fallback to LocalStorage
    const saved = localStorage.getItem('client_project_inquiries');
    return saved ? JSON.parse(saved) : [];
  },

  /**
   * Insert a new inquiry
   */
  async insertInquiry(inquiry: any): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          id: inquiry.id,
          email: inquiry.email,
          business: inquiry.business,
          type: inquiry.type,
          team_size: inquiry.teamSize,
          budget: inquiry.budget,
          contact: inquiry.contact,
          status: inquiry.status || 'Reviewing Brief',
          created_at: new Date().toISOString()
        }]);

      if (!error) return true;
      console.error("Supabase insert error, saving locally:", error);
    }

    // Save to LocalStorage
    const saved = localStorage.getItem('client_project_inquiries');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(inquiry);
    localStorage.setItem('client_project_inquiries', JSON.stringify(list));
    return true;
  },

  /**
   * Update status of an inquiry
   */
  async updateStatus(id: string, status: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (!error) return true;
      console.error("Supabase update error:", error);
    }

    // Save locally
    const saved = localStorage.getItem('client_project_inquiries');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map((p: any) => p.id === id ? { ...p, status } : p);
      localStorage.setItem('client_project_inquiries', JSON.stringify(updated));
    }
    return true;
  },

  /**
   * Delete an inquiry
   */
  async deleteInquiry(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (!error) return true;
      console.error("Supabase delete error:", error);
    }

    // Save locally
    const saved = localStorage.getItem('client_project_inquiries');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.filter((p: any) => p.id !== id);
      localStorage.setItem('client_project_inquiries', JSON.stringify(updated));
    }
    return true;
  },

  /**
   * Send a confirmation email to the client
   * Local Dev: Directly calls the Vite-proxied Resend endpoint using local env key
   * Production: Securely calls the server-side Vercel/Netlify Serverless Function
   */
  async sendConfirmationEmail(params: {
    email: string;
    projectType: string;
    business: string;
    inquiryId: string;
  }): Promise<boolean> {
    const { email, projectType, business, inquiryId } = params;
    const isDev = import.meta.env.DEV;

    try {
      if (isDev) {
        // --- LOCAL DEVELOPMENT ONLY ---
        // Stored under import.meta.env.DEV check so it gets completely tree-shaken and stripped from production builds.
        const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
        if (!RESEND_API_KEY) {
          console.warn('VITE_RESEND_API_KEY not set in local .env — skipping confirmation email');
          return false;
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

        const res = await fetch('/api/resend/emails', {
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

        if (!res.ok) {
          const err = await res.json();
          console.error('Local Resend API error:', err);
          return false;
        }
        return true;
      } else {
        // --- PRODUCTION SECURE ROUTE ---
        // Secure server-side call where RESEND_API_KEY is retrieved securely from Vercel/Netlify backend env variables.
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            projectType,
            business,
            inquiryId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Production Serverless Email API error:', err);
          return false;
        }
        return true;
      }
    } catch (err) {
      console.error('sendConfirmationEmail failed:', err);
      return false;
    }
  }
};

