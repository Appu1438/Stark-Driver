// utils/socket/driverSocketService.ts

type DriverLocationPayload = {
  latitude: number;
  longitude: number;
  heading?: number;
};

class DriverSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private queue: any[] = [];

  // allow multiple listeners
  private connectListeners = new Set<() => void>();
  private messageListeners = new Set<(data: any) => void>();
  private errorListeners = new Set<(e: any) => void>();

  connect() {
    if (this.socket && this.isConnected) return;

    const url = process.env.EXPO_PUBLIC_SOCKET_URL!;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("✅ Driver Socket connected");
      this.isConnected = true;

      // Send queued messages
      this.queue.forEach((msg) => this.socket?.send(msg));
      this.queue = [];

      // notify all listeners
      this.connectListeners.forEach((cb) => cb());
    };

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        this.messageListeners.forEach((cb) => cb(message));
      } catch (err) {
        console.error("❌ Invalid message format", err);
      }
    };

    this.socket.onerror = (e) => {
      console.error("❌ Socket error:", e);
      this.errorListeners.forEach((cb) => cb(e));
    };

    this.socket.onclose = (e) => {
      console.warn("🔌 Socket closed:", e.code, e.reason);
      this.isConnected = false;
      this.socket = null;
      setTimeout(() => this.connect(), 3000); // Auto reconnect
    };
  }

  send(data: any) {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("Socket not connected. Queuing message:", data);
      this.queue.push(JSON.stringify(data));
    }
  }

  sendLocationUpdate(driverId: string, location: DriverLocationPayload) {
    const message = {
      type: "locationUpdate",
      role: "driver",
      driver: driverId,
      data: location,
    };
    this.send(message);
  }

  // multi-listener safe subscription
  onConnected(cb: () => void) {
    this.connectListeners.add(cb);
    return () => this.connectListeners.delete(cb);
  }

  onMessage(cb: (data: any) => void) {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  onError(cb: (e: any) => void) {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.isConnected = false;
  }

  clearListeners() {
    this.connectListeners.clear();
    this.messageListeners.clear();
    this.errorListeners.clear();
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

const driverSocketService = new DriverSocketService();
export default driverSocketService;
