import nodemailer from "nodemailer";

export async function sendWelcomeEmail(to: string, name: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? "Recetario <no-reply@recetario.local>";

  if (!host || !user || !pass) {
    console.info(`Correo de bienvenida omitido para ${to}: SMTP no configurado.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const safeName = name.trim() || "chef";
  const subject = "Bienvenido a Recetario";

  const text = [
    `Hola ${safeName},`,
    "",
    "Tu cuenta ya esta activa en Recetario.",
    "Explora recetas, guarda tus favoritas y organiza tus platos en un solo lugar.",
    "",
    `Comenzar ahora: ${appUrl}`,
    "",
    "Gracias por unirte.",
    "Equipo Recetario",
  ].join("\n");

  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin:0; padding:0; background:#f4f7f5; font-family:Verdana, Geneva, Tahoma, sans-serif; color:#1f2937;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f5; padding:24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
                <tr>
                  <td style="background:linear-gradient(120deg, #0f7a55 0%, #16a34a 100%); padding:28px 30px; color:#ffffff;">
                    <div style="font-size:13px; letter-spacing:0.8px; text-transform:uppercase; opacity:0.9;">Recetario</div>
                    <h1 style="margin:10px 0 0; font-size:28px; line-height:1.2;">Bienvenido, ${safeName}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 30px 8px; font-size:16px; line-height:1.6;">
                    Tu cuenta ya esta lista. Desde ahora puedes explorar recetas publicas, guardar favoritas y consultar los detalles de cada plato cuando quieras.
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 30px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:0 0 14px; font-size:14px; color:#4b5563;">Que puedes hacer ahora:</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 8px; font-size:14px; color:#111827;">- Descubrir nuevas recetas del catalogo</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 8px; font-size:14px; color:#111827;">- Guardar tus platos favoritos</td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 8px; font-size:14px; color:#111827;">- Organizar tus ideas para cocinar</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 30px 30px;">
                    <a href="${appUrl}" style="display:inline-block; background:#0f7a55; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:700; font-size:14px;">Ir a Recetario</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 30px 26px; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280;">
                    Si no solicitaste este registro, puedes ignorar este mensaje.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}
