import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Email notification route
  app.post("/api/email/notify-publish", async (req, res) => {
    try {
      const { title, author, url } = req.body;
      const smtpUser = process.env.SMTP_USER; // e.g. votresite@gmail.com
      const smtpPass = process.env.SMTP_PASS; // App password
      
      if (!smtpUser || !smtpPass) {
        console.warn("Emails not sent: SMTP_USER and SMTP_PASS environment variables are required.");
        return res.status(200).json({ status: "skipped", reason: "no_smtp_credentials" });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      
      const rawBcc = req.body.bccEmails || [];
      const bccList = Array.isArray(rawBcc) 
        ? rawBcc.map(e => e?.trim()).filter(e => e && e.includes('@')) 
        : [];
      
      console.log(`[Email] Sending to cam.drean35@gmail.com with ${bccList.length} BCC recipients.`);

      await transporter.sendMail({
        from: `"Baroudeur World Cup" <${smtpUser}>`,
        to: "cam.drean35@gmail.com", // Send to admin as primary recipient
        bcc: bccList.join(", "), // Blind Carbon Copy
        subject: `Nouvel article publié : ${title}`,
        html: `
          <div style="font-family: 'Space Grotesk', sans-serif; background-color: #FFFDF5; color: #000000; padding: 40px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 4px solid #000000; padding: 40px; box-shadow: 8px 8px 0px 0px #000000;">
              
              <div style="background-color: #0A3161; padding: 20px; border: 4px solid #000000; margin-bottom: 20px; color: #FFFFFF; text-transform: uppercase;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">★ NOUVEL ARTICLE ★</h1>
              </div>

              <h2 style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; border-bottom: 4px solid #000000; padding-bottom: 15px;">${title}</h2>
              <p style="font-size: 16px; font-weight: bold; background-color: #FFD600; display: inline-block; padding: 5px 10px; border: 2px solid #000000; margin-bottom: 20px;">
                PAR ${author}
              </p>
              
              ${req.body.customMessage ? `<div style="text-align: left; background-color: #FFFDF5; border: 2px dashed #000000; padding: 20px; font-size: 16px; margin-bottom: 30px; font-weight: bold;">${req.body.customMessage.replace(/\n/g, '<br>')}</div>` : ''}
              
              <div style="margin-top: 30px;">
                <a href="${url}" style="background-color: #E6192B; color: #FFFFFF; padding: 15px 30px; text-decoration: none; font-weight: 900; font-size: 18px; text-transform: uppercase; border: 4px solid #000000; display: inline-block; box-shadow: 4px 4px 0px 0px #000000;">
                  LIRE L'ARTICLE
                </a>
              </div>
              
              <div style="margin-top: 40px; border-top: 4px solid #000000; padding-top: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                BAROUDEUR WORLD CUP
              </div>
            </div>
          </div>
        `
      });

      res.json({ status: "ok" });
    } catch (err: any) {
      console.error("Email error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  const API_KEY = process.env.FOOTBALL_API_KEY;
  
  app.get("/api/football/fixtures", async (req, res) => {
    try {
      // Fetch from api-football for World Cup (league 1), Season 2022 due to free-tier restrictions on 2026.
      const response = await fetch("https://v3.football.api-sports.io/fixtures?league=1&season=2026", {
        headers: { "x-apisports-key": API_KEY }
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      res.json({ response: data.response || [] });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/football/fixtures/:id", async (req, res) => {
    try {
      const fixtureId = req.params.id;
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, {
        headers: { "x-apisports-key": API_KEY }
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      if (data.response && data.response.length > 0) {
         res.json({ response: data.response });
      } else {
         res.json({ response: [] });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get("/api/football/teams/:id/form", async (req, res) => {
    try {
      const teamId = req.params.id;
      // Get recent matches for the team in api-football
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?team=${teamId}&last=5`, {
         headers: { "x-apisports-key": API_KEY }
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      
      let formStr = "";
      if (data.response) {
        for (const match of data.response) {
          const hScore = match.goals.home;
          const aScore = match.goals.away;
          if (hScore === aScore) formStr += "D";
          else if (match.teams.home.id.toString() === teamId) {
             formStr += hScore > aScore ? "W" : "L";
          } else {
             formStr += aScore > hScore ? "W" : "L";
          }
        }
      }
      res.json({ response: { form: formStr || "N/A" } });
    } catch (err: any) {
       console.error(err);
       res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
