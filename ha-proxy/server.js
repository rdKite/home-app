import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const target = process.env.HA_BASE;   // z. B. http://homeassistant:8123
const token  = process.env.HA_TOKEN;

if (!target || !token) {
    console.error("Fehler: HA_BASE oder HA_TOKEN fehlt!");
    process.exit(1);
}

// CORS erlauben
app.use(cors({
    origin: "*",  // oder deine echte Domain
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Proxy für Home Assistant
app.use(
    "/ha",
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { "^/ha": "" },
        headers: { Authorization: `Bearer ${token}` },
        ws: true,
        onProxyReq: (proxyReq) => {
            proxyReq.setHeader("Authorization", `Bearer ${token}`);
        }
    })
);

app.get("/healthz", (_, res) => res.send("ok"));

const port = process.env.PORT || 4000;
app.listen(port, () =>
    console.log(`Proxy läuft auf Port ${port}, leitet an ${target} weiter`)
);
