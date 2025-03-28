import { createTransport } from "nodemailer"

type Theme = {
    brandColor?: string;
    buttonText?: string;
  };

async function sendVerificationRequest(params : any) {
  const { identifier, url, provider, theme } = params
  const { host } = new URL(url)
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  })
  const failed = result.rejected.filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

export {sendVerificationRequest}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
    const { url, host, theme } = params;
  
    const brandColor = theme.brandColor || "#EE5D4B";
    const color = {
      background: "#1F1A18",
      text: "#fff",
      cardBackground: "#2E2A28",
      buttonBackground: "#EE5D4B",
      buttonText: "#fff",
    };
  
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: ${color.background}; font-family: 'Chakra Petch', Arial, sans-serif; color: ${color.text};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${color.cardBackground}; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
<tr>
  <td align="center" style="padding: 20px 0; font-size: 22px; font-family: 'Chakra Petch', Arial, sans-serif; color:${color.text};">
    Welcome to the <strong>SKOR AI Agents</strong> platform!
  </td>
</tr>
<tr>
  <td align="center" style="padding: 20px 0; font-size: 22px; font-family: 'Chakra Petch', Arial, sans-serif; color: ${color.text};">
    Sign in to <strong>${host}</strong>
  </td>
</tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px; background: ${color.buttonBackground};">
                  <a href="${url}" target="_blank"
                     style="display: inline-block; font-size: 18px; font-family: 'Chakra Petch', Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">
                    Sign In
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px; font-size: 16px; line-height: 22px; font-family: 'Chakra Petch', Arial, sans-serif; color: ${color.text};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  </html>
    `;
  }

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}