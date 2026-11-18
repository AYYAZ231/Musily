import Peer, { DataConnection } from 'peerjs';
import { PartyRoom, Track, Participant, ChatMessage, Reaction } from '../types';

export type PartyEventType =
  | 'SYNC_STATE'
  | 'PLAY'
  | 'PAUSE'
  | 'SEEK'
  | 'SKIP'
  | 'ADD_QUEUE'
  | 'VOTE_TRACK'
  | 'PASS_AUX'
  | 'TOGGLE_DROP'
  | 'CHAT'
  | 'REACTION'
  | 'USER_JOINED'
  | 'USER_LEFT';

export interface PartyMessage {
  type: PartyEventType;
  payload: any;
  senderId: string;
  senderName: string;
}

type PartyListener = (event: PartyMessage) => void;

export class PartyP2PService {
  private static instance: PartyP2PService;
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';
  private currentUserId: string = '';
  private currentUserName: string = '';
  private listeners: Set<PartyListener> = new Set();
  private isConnected: boolean = false;

  private constructor() {
    this.currentUserId = 'user_' + Math.random().toString(36).substring(2, 9);
    this.currentUserName = 'VibeSeeker_' + Math.floor(Math.random() * 900 + 100);
  }

  static getInstance(): PartyP2PService {
    if (!PartyP2PService.instance) {
      PartyP2PService.instance = new PartyP2PService();
    }
    return PartyP2PService.instance;
  }

  getUserId() {
    return this.currentUserId;
  }

  getUserName() {
    return this.currentUserName;
  }

  setUserName(name: string) {
    this.currentUserName = name;
  }

  getIsHost() {
    return this.isHost;
  }

  getRoomCode() {
    return this.roomCode;
  }

  getIsConnected() {
    return this.isConnected;
  }

  // Create room as Host (Host Peer ID = musily-party-{roomCode})
  async createRoom(userName?: string): Promise<string> {
    if (userName) this.currentUserName = userName;
    this.leaveRoom();

    // 6-digit alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.roomCode = code;
    this.isHost = true;

    return new Promise((resolve, reject) => {
      const peerId = `musily-party-${code}`;
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        this.isConnected = true;
        resolve(code);
      });

      this.peer.on('connection', (conn) => {
        this.setupHostConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        // If ID taken, generate another code and retry once
        if (err.type === 'unavailable-id') {
          this.createRoom(userName).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
    });
  }

  // Setup incoming guest connection on Host
  private setupHostConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);

      // Listen for data from this guest
      conn.on('data', (data: any) => {
        const msg = data as PartyMessage;
        this.emit(msg);

        // Relaying to all other connected peers
        this.broadcast(msg, conn.peer);
      });
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.emit({
        type: 'USER_LEFT',
        payload: { peerId: conn.peer },
        senderId: 'system',
        senderName: 'System'
      });
    });
  }

  // Join an existing party room as Guest
  async joinRoom(roomCode: string, userName?: string): Promise<boolean> {
    if (userName) this.currentUserName = userName;
    this.leaveRoom();

    const cleanCode = roomCode.trim().toUpperCase().replace('MUSILY-PARTY-', '').replace('#', '');
    this.roomCode = cleanCode;
    this.isHost = false;

    return new Promise((resolve, reject) => {
      const guestPeerId = `musily-guest-${Math.random().toString(36).substring(2, 9)}`;
      this.peer = new Peer(guestPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', () => {
        const targetHostId = `musily-party-${cleanCode}`;
        const conn = this.peer!.connect(targetHostId, {
          reliable: true
        });

        conn.on('open', () => {
          this.hostConnection = conn;
          this.isConnected = true;

          // Notify host that we joined
          this.sendMessage({
            type: 'USER_JOINED',
            payload: {
              id: this.currentUserId,
              name: this.currentUserName,
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${this.currentUserId}`
            },
            senderId: this.currentUserId,
            senderName: this.currentUserName
          });

          resolve(true);
        });

        conn.on('data', (data: any) => {
          this.emit(data as PartyMessage);
        });

        conn.on('close', () => {
          this.isConnected = false;
          this.emit({
            type: 'USER_LEFT',
            payload: { message: 'Host disconnected' },
            senderId: 'system',
            senderName: 'System'
          });
        });

        conn.on('error', (err) => {
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Send message from Guest to Host OR from Host to everyone
  sendMessage(msg: PartyMessage) {
    if (this.isHost) {
      // Host broadcasts to all guests
      this.broadcast(msg);
      // Also notify local listeners
      this.emit(msg);
    } else if (this.hostConnection && this.hostConnection.open) {
      // Guest sends to host
      this.hostConnection.send(msg);
    }
  }

  // Broadcast to all guests (Host only)
  private broadcast(msg: PartyMessage, excludePeerId?: string) {
    this.connections.forEach((conn, peerId) => {
      if (peerId !== excludePeerId && conn.open) {
        conn.send(msg);
      }
    });
  }

  // Subscribe to party events
  subscribe(listener: PartyListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(msg: PartyMessage) {
    this.listeners.forEach((fn) => fn(msg));
  }

  leaveRoom() {
    if (this.hostConnection) {
      this.hostConnection.close();
      this.hostConnection = null;
    }
    this.connections.forEach((c) => c.close());
    this.connections.clear();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isConnected = false;
    this.isHost = false;
    this.roomCode = '';
  }
}
