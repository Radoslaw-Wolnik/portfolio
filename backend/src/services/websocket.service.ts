import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger.util';
import environment from '../config/environment';

export enum ContainerStatus {
  CREATING = 'creating',
  STARTING = 'starting',
  RUNNING = 'running',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  ERROR = 'error'
}

interface StatusUpdate {
  status: ContainerStatus;
  message: string;
  containerId?: string;
  error?: string;
}

class WebSocketService {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: environment.app.frontendUrl,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      logger.info('New WebSocket connection established', { socketId: socket.id });

      socket.on('joinSession', (sessionId: string) => {
        socket.join(sessionId);
        logger.info(`Socket joined session: ${sessionId}`, { socketId: socket.id });
      });

      socket.on('leaveSession', (sessionId: string) => {
        socket.leave(sessionId);
        logger.info(`Socket left session: ${sessionId}`, { socketId: socket.id });
      });

      socket.on('disconnect', () => {
        logger.info('WebSocket connection closed', { socketId: socket.id });
      });
    });
  }

  emitContainerStatus(sessionId: string, update: StatusUpdate): void {
    try {
      this.io.to(sessionId).emit('containerStatus', update);
      logger.info(`Emitted container status update for ${sessionId}`, { update });
    } catch (error) {
      logger.error(`Error emitting container status for ${sessionId}`, { error });
    }
  }

  emitSessionUpdate(sessionId: string, data: any): void {
    try {
      this.io.to(sessionId).emit('sessionUpdate', data);
      logger.info(`Emitted session update for ${sessionId}`, { data });
    } catch (error) {
      logger.error(`Error emitting session update for ${sessionId}`, { error });
    }
  }
}

let webSocketService: WebSocketService;

export const initializeWebSocketService = (httpServer: HttpServer): void => {
  webSocketService = new WebSocketService(httpServer);
};

export const getWebSocketService = (): WebSocketService => {
  if (!webSocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return webSocketService;
};