import express from "express";

export default class Server {
  public app: express.Application;
  // port from env
  public port: number = Number(process.env.PORT) || 3000;

  constructor() {
    this.app = express();
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}
