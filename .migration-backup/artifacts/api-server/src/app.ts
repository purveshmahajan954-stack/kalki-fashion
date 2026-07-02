import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const SESSION_SECRET = process.env.SESSION_SECRET ?? "elara_session_secret_2024";
const sessions = new Map<string, Record<string, any>>();

app.use((req: any, _res, next) => {
  let sessionId = req.cookies?.session_id;
  if (!sessionId) {
    sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {});
  }
  req.session = sessions.get(sessionId)!;
  req.sessionId = sessionId;
  next();
});

app.use((_req: any, res, next) => {
  const req = _req as any;
  const originalEnd = res.end.bind(res);
  (res as any).end = (...args: any[]) => {
    if (req.sessionId) {
      res.cookie("session_id", req.sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
    }
    return (originalEnd as any)(...args);
  };
  next();
});

app.use("/api", router);

export default app;
