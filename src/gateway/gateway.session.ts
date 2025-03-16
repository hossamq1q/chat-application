import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../utils/interfaces';

export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;

  setUserSocket(id: number, socket: AuthenticatedSocket): void;

  removeUserSocket(id: number): void;

  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();

  getUserSocket(id: number): AuthenticatedSocket {
    return this.sessions.get(id);
  }

  setUserSocket(id: number, socket: AuthenticatedSocket): void {
    this.sessions.set(id, socket);
  }

  removeUserSocket(id: number): void {
    this.sessions.delete(id);
  }

  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
