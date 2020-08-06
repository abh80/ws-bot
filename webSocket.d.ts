/// <reference types="node" />
// non auto generated definitions completely handwritten and formatted using prettier
import { EventEmitter } from "events";
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
  };
}
export class WebSocket extends EventEmitter {
  token: string;
  ws: any;
  constructor(token: string);
  login(): void;
  getReturnable(): {
    op: number;
    d: {
      token: string;
      properties: {
        $os: any;
        $browser: string;
        $device: string;
      };
    };
  };
  handleMsg(data: string, flag: any): void;
  destroy(reason?: string): void;
  evaluate(data: string, flag: any): any;
  sendMessage(channel: string, content: object | string): Promise<JSON>;
  err(error: string): void;
  MessageEmbed(channel: string, options: EmbedProps): Promise<JSON>;
}
export default WebSocket;
