const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  
  if (!event.body) {
    return { statusCode: 400, body: "Bad Request" };
  }

  const body = JSON.parse(event.body);
  const { title, author, url } = body;
  
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpUser || !smtpPass) {
    return { 
      statusCode: 200, 
      body: JSON.stringify({ status: "skipped", reason: "no_smtp_credentials" }),
      headers: { "Content-Type": "application/json" }
    };
  }
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });
    
    await transporter.sendMail({
      from: `"Baroudeur World Cup" <${smtpUser}>`,
      to: "cam.drean35@gmail.com",
      subject: `Nouvel article publié : ${title}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="text-transform: uppercase;">Un nouvel article est en ligne !</h1>
          <h2>${title}</h2>
          <p><strong>Auteur :</strong> ${author}</p>
          <p><a href="${url}" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">LIRE L'ARTICLE</a></p>
        </div>
      `
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" }),
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
