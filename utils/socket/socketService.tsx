// utils/socket/driverSocketService.ts

type DriverLocationPayload = {
  latitude: number;
  longitude: number;
  heading?: number;
};

class DriverSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private queue: any[] = [];

  private onConnectCallback: (() => void) | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onErrorCallback: ((e: any) => void) | null = null;

  connect() {
    if (this.socket && this.isConnected) return;

    const url = process.env.EXPO_PUBLIC_SOCKET_URL!;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("✅ Driver Socket connected");
      this.isConnected = true;

      // Send queued messages if any
      this.queue.forEach((msg) => this.socket?.send(msg));
      this.queue = [];

      if (this.onConnectCallback) this.onConnectCallback();
    };

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        this.onMessageCallback?.(message);
      } catch (err) {
        console.error("❌ Invalid message format", err);
      }
    };

    this.socket.onerror = (e) => {
      console.error("❌ Socket error:", e);
      this.onErrorCallback?.(e);
    };

    this.socket.onclose = (e) => {
      console.warn("🔌 Socket closed:", e.code, e.reason);
      this.isConnected = false;
      this.socket = null;
      setTimeout(() => this.connect(), 3000); // Auto reconnect
    };
  }
  // ✅ Generic send method for any message type
  send(data: any) {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("Socket not connected. Message not sent:", data);
    }
  }

  sendLocationUpdate(driverId: string, location: DriverLocationPayload) {
    const message = JSON.stringify({
      type: "locationUpdate",
      role: "driver",
      driver: driverId,
      data: location,
    });

    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn("📪 Socket not ready. Queuing location update.");
      this.queue.push(message);
    }
  }

  onConnected(cb: () => void) {
    this.onConnectCallback = cb;
  }

  onMessage(cb: (data: any) => void) {
    this.onMessageCallback = cb;
  }

  onError(cb: (e: any) => void) {
    this.onErrorCallback = cb;
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.isConnected = false;
  }

  clearListeners() {
    this.onConnectCallback = null;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

const driverSocketService = new DriverSocketService();
export default driverSocketService;
