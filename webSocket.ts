const ws = require("ws");
import fetch from "node-fetch";
import { EventEmitter } from "events";
const zlib = require("zlib-sync");
export interface msgProps {
  content?: string;
}
export interface EmbedProps {
  content?: string;
  embed?: {
    title?: string;
    description?: string;
    field?: object[];
    footer?: any;
    author?: any;
    color?: number;
    thumbnail?: string;
    image?: string;
  };
}
export class WebSocket extends EventEmitter {
  token: string;
  ws: any;
  constructor(token: string) {
    super();
    if (!token) throw new Error("No token was provided lol");
    this.token = token;
  }
  login() {
    this.emit("debug", "Attempting to Connect");
    this.ws = new ws("wss://gateway.discord.gg/?v=8&encoding=json");
    this.ws.once("open", () => {
      this.emit("debug", "connected attempting to login....");
      const data = this.getReturnable();
      this.ws.send(JSON.stringify(data));
      this.ws.once("error", this.err.bind(this));
      this.ws.on("message", this.handleMsg.bind(this));
      this.ws.on("close", () => {
        this.emit(
          "debug",
          "The connection closed unexpectedly attempting to reconnect"
        );
        this.login();
        this.emit("Connected lol");
      });
    });
  }
  getReturnable() {
    const returnable = {
      op: 2,
      d: {
        token: this.token,
        properties: {
          $os: require("os").platform,
          $browser: "DiscordScriptF",
          $device: "DiscordScript",
        },
      },
    };
    return returnable;
  }
  handleMsg(data: string, flag: any) {
    const msg = this.evaluate(data, flag);
    if (msg.t === "READY") {
      this.emit("ready", msg.d.user);
    } else if (msg.t === "MESSAGE_CREATE") {
      this.emit("message", msg.d);
    }
  }
  destroy(reason?: string) {
    this.ws.close();
    this.emit(
      "debug",
      `Client Destroyed for : ${reason ? reason : "No reason was Given"}`
    );
  }
  evaluate(data: string, flag: any) {
    if (typeof flag !== "object") flag = {};
    if (!flag.binary) return JSON.parse(data);
    const inflated = zlib.inflate();
    inflated.push(data, zlib.Z_SYNC_FLUSH);
    if (inflated.err) throw new Error("ERROR OCCURED while decompressing");
    return JSON.parse(inflated.toString());
  }
  async sendMessage(channel: string, content: object | string) {
    const thisUrl = `https://discord.com/api/v7/channels/${channel}/messages`;
    let b: msgProps = {}
    if (!content) throw new Error("CANNOT send an Empty message lol");
    if (typeof content === "string") b.content = content;
    if (typeof content === "object") b = content;
    const data = await fetch(thisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bot ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(b),
    });
    return data.json();
  }
  err(error: string) {
    this.emit("error", error);
  }
  async MessageEmbed(channel:string,options:EmbedProps){
    const thisUrl = `https://discord.com/api/v7/channels/${channel}/messages`;
    if(!options)throw new Error('CANNOT send an Empty message lol')
    const data = await fetch(thisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bot ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    return data.json();
  }
}
export default WebSocket;
