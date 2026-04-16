import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { BackendSession } from './sessions.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket | null = null;

  private connectionStatusSubject = new Subject<boolean>();
  private prenotazioniChangedSubject = new Subject<void>();

  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  public prenotazioniChanged$ = this.prenotazioniChangedSubject.asObservable();

  constructor(private backendSession: BackendSession) {}

  connect(): void {
    const token = this.backendSession.sessionToken;

    if (!token) {
      return;
    }

    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Errore connessione socket:', error.message);
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('prenotazione:created', () => {
      this.prenotazioniChangedSubject.next();
    });

    this.socket.on('prenotazione:updated', () => {
      this.prenotazioniChangedSubject.next();
    });

    this.socket.on('prenotazione:deleted', () => {
      this.prenotazioniChangedSubject.next();
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connectionStatusSubject.next(false);
  }

  joinAula(aulaId: number): void {
    this.socket?.emit('join:aula', aulaId);
  }

  leaveAula(aulaId: number): void {
    this.socket?.emit('leave:aula', aulaId);
  }
}