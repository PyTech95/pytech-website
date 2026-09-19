// Gmail SMTP mailer (Node runtime) using nodemailer + admin-configured settings.
import nodemailer from 'nodemailer';

export function buildTransport(cfg) {
  const port = Number(cfg.port) || 465;
  return nodemailer.createTransport({
    host: cfg.host || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });
}

function esc(s = '') {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export const DEFAULT_RECIPIENT = 'rajeev.pytech@gmail.com';

// Sends a contact/lead enquiry notification.
export async function sendLeadEmail(cfg, lead, adminUrl) {
  const transporter = buildTransport(cfg);
  const fromName = cfg.fromName || 'PyTech Website';
  const to = cfg.recipient || cfg.user || DEFAULT_RECIPIENT;
  const rows = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Service', lead.service],
    ['Project type', lead.projectType],
    ['Pages', lead.pages],
    ['App type', lead.appType],
    ['Budget', lead.budget],
    ['Timeline', lead.timeline],
    ['Source', lead.source],
    ['Page', lead.pageSource],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0f172a">
      <div style="background:#0b0f19;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;font-size:18px">New website enquiry</h2>
        <p style="margin:6px 0 0;color:#94a3b8;font-size:13px">via pytechdigital.com</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#64748b;width:170px">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join('')}
        </table>
        ${lead.message ? `<div style="margin-top:16px"><p style="color:#64748b;font-size:13px;margin:0 0 4px">Message</p><p style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:0">${esc(lead.message)}</p></div>` : ''}
        <p style="margin-top:16px;font-size:13px;color:#64748b">${adminUrl ? `View all leads in the <a href="${adminUrl}">Admin panel</a>.` : ''}</p>
      </div>
    </div>`;

  return transporter.sendMail({
    from: `"${fromName}" <${cfg.user}>`,
    to,
    replyTo: lead.email || undefined,
    subject: `New enquiry — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
    html,
  });
}

// Sends a job application notification. `attachment` = { filename, content(Buffer), contentType } | null
export async function sendApplicationEmail(cfg, app, attachment, adminUrl) {
  const transporter = buildTransport(cfg);
  const fromName = cfg.fromName || 'PyTech Careers';
  const to = cfg.recipient || cfg.user || DEFAULT_RECIPIENT;
  const rows = [
    ['Role', app.role],
    ['Name', app.name],
    ['Email', app.email],
    ['Phone', app.phone],
    ['Experience', app.experience],
    ['Current company', app.company],
    ['LinkedIn / Portfolio', app.portfolio],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0f172a">
      <div style="background:#0b0f19;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;font-size:18px">New job application — ${esc(app.role)}</h2>
        <p style="margin:6px 0 0;color:#94a3b8;font-size:13px">via pytechdigital.com careers</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#64748b;width:170px">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join('')}
        </table>
        ${app.coverLetter ? `<div style="margin-top:16px"><p style="color:#64748b;font-size:13px;margin:0 0 4px">Cover note</p><p style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:0">${esc(app.coverLetter)}</p></div>` : ''}
        <p style="margin-top:16px;font-size:13px;color:#64748b">Resume is attached${adminUrl ? `. View all applications in the <a href="${adminUrl}">Admin panel</a>.` : '.'}</p>
      </div>
    </div>`;

  const attachments = attachment ? [{ filename: attachment.filename, content: attachment.content, contentType: attachment.contentType }] : [];

  return transporter.sendMail({
    from: `"${fromName}" <${cfg.user}>`,
    to,
    replyTo: app.email || undefined,
    subject: `New application — ${app.role} — ${app.name}`,
    html,
    attachments,
  });
}
