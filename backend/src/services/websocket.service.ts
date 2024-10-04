import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class WebSocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected');
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  public sendUpdate(sessionId: string, status: string) {
    this.io.emit(`session-update-${sessionId}`, { status });
  }
}

let webSocketService: WebSocketService;

export const initializeWebSocketService = (server: HttpServer) => {
  webSocketService = new WebSocketService(server);
};

export const getWebSocketService = () => {
  if (!webSocketService) {
    throw new Error('WebSocketService not initialized');
  }
  return webSocketService;
};