declare namespace Express {
  interface Request {
    session?: Record<string, any>;
    sessionId?: string;
  }
}
