import { SOCKET_URL } from "shared/api/socketConfig";
import { WebSocketMessage } from "./model";

type Listener = (payload: any) => void;

export class ChatSocketService {
  private static socket: WebSocket | null = null;
  private static listeners: Record<string, Set<Listener>> = {};

  static connect(userId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(`${SOCKET_URL}/ws/chat/${userId}`);

    this.socket.onopen = () => {
      this.sendPing();
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.emit(message.type, message.data);
      } catch (e) {
        console.error("WebSocket parse error:", e, event.data);
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.listeners = {};
    };

    this.socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };
  }

  static disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners = {};
  }

  static sendMessage(message: any): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not open, cannot send message");
      return;
    }
    const wsMsg: WebSocketMessage = {
      type: "new_message",
      data: message,
    };

    this.socket.send(JSON.stringify(wsMsg));
  }

  static sendPing(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "ping" }));
    }
  }

  static on<T = any>(type: string, callback: (payload: T) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = new Set();
    }
    this.listeners[type].add(callback);
  }

  static off<T = any>(type: string, callback: (payload: T) => void): void {
    this.listeners[type]?.delete(callback);
  }

  private static emit<T = any>(type: string, payload: T): void {
    this.listeners[type]?.forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error("Listener error for", type, e);
      }
    });
  }
}
