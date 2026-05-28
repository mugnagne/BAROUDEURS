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
      
      // In a real app, you would fetch subscriber emails from your database.
      // Here we send a notification to the admin.
      await transporter.sendMail({
        from: `"Baroudeur World Cup" <${smtpUser}>`,
        to: "cam.drean35@gmail.com", // Send notification to admin
        subject: `Nouvel article publié : ${title}`,
        html: `
          <div style="font-family: sans-serif; p: 20px;">
            <h1 style="text-transform: uppercase;">Un nouvel article est en ligne !</h1>
            <h2>${title}</h2>
            <p><strong>Auteur :</strong> ${author}</p>
            <p><a href="${url}" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">LIRE L'ARTICLE</a></p>
          </div>
        `
      });

      res.json({ status: "ok" });
    } catch (err: any) {
      console.error("Email error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API route to get matches for WC 2022
  app.get("/api/football/fixtures", async (req, res) => {
    try {
      const apiKey = process.env.FOOTBALL_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "FOOTBALL_API_KEY is not defined" });
      }

      // League 1 is World Cup, Season 2022
      const response = await fetch("https://v3.football.api-sports.io/fixtures?league=1&season=2022", {
        headers: {
          "x-apisports-key": apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // API route to get single match details
  app.get("/api/football/fixtures/:id", async (req, res) => {
    try {
      const apiKey = process.env.FOOTBALL_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "FOOTBALL_API_KEY is not defined" });
      }

      const fixtureId = req.params.id;
      // Get detailed stats, lineups and events
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, {
        headers: {
          "x-apisports-key": apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // API route to get team form
  app.get("/api/football/teams/:id/form", async (req, res) => {
    try {
      const apiKey = process.env.FOOTBALL_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "FOOTBALL_API_KEY is not defined" });
      }
      const teamId = req.params.id;
      // We can get form from team statistics but it needs league and season
      const response = await fetch(`https://v3.football.api-sports.io/teams/statistics?league=1&season=2022&team=${teamId}`, {
         headers: {
          "x-apisports-key": apiKey
        }
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      res.json(data);
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
