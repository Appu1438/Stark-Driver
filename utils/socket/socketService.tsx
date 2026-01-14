type DriverLocationPayload = {
  latitude: number;
  longitude: number;
  heading?: number;
};

class DriverSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;

  private pingInterval: any = null;
  private reconnectTimeout: any = null;

  // ✅ Keep only latest queued payload (important for location updates)
  private queuedPayload: string | null = null;

  private hasShownDisconnectToast = false;

  /* ---------- LISTENERS ---------- */
  private connectListeners = new Set<() => void>();
  private messageListeners = new Set<(data: any) => void>();
  private errorListeners = new Set<(e: any) => void>();

  /* ===============================
     💓 HEARTBEAT
  =============================== */

  private startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        console.log("💓 [DRIVER_SOCKET] ping");
        this.socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
  }

  private stopPing() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = null;
  }

  /* ===============================
     🔌 CONNECTION
  =============================== */

  connect() {
    if (this.socket) return;

    console.log("🔌 [DRIVER_SOCKET] connecting…");
    this.socket = new WebSocket(process.env.EXPO_PUBLIC_SOCKET_URL!);

    this.socket.onopen = () => {
      console.log("✅ [DRIVER_SOCKET] connected");
      this.isConnected = true;
      this.hasShownDisconnectToast = false;

      // Clear reconnect timer if exists
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      this.startPing();

      // Flush latest queued payload only
      if (this.queuedPayload) {
        this.socket.send(this.queuedPayload);
        console.log("📤 [DRIVER_SOCKET] flushed queued payload");
        this.queuedPayload = null;
      }

      this.connectListeners.forEach(cb => cb());
    };

    this.socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        this.messageListeners.forEach(cb => cb(message));
      } catch (err) {
        console.error("❌ [DRIVER_SOCKET] invalid message", err);
      }
    };

    this.socket.onerror = (e) => {
      console.error("❌ [DRIVER_SOCKET] error", e);
      this.errorListeners.forEach(cb => cb(e));
    };

    this.socket.onclose = () => {
      console.warn("⚠️ [DRIVER_SOCKET] disconnected");

      this.cleanup();

      if (!this.hasShownDisconnectToast) {
        this.hasShownDisconnectToast = true;
      }

      // Prevent duplicate reconnect timers
      if (this.reconnectTimeout) return;

      this.reconnectTimeout = setTimeout(() => {
        this.reconnectTimeout = null;
        this.connect();
      }, 3000);
    };
  }

  private cleanup() {
    this.stopPing();
    this.isConnected = false;
    this.socket = null;
  }

  /* ===============================
     📦 SEND
  =============================== */

  send(data: any) {
    const payload = JSON.stringify(data);

    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    } else {
      // ✅ overwrite old payload (do not grow queue)
      this.queuedPayload = payload;
      console.warn("📦 [DRIVER_SOCKET] queued latest payload");
    }
  }

  /* ===============================
     🚕 DRIVER ACTIONS
  =============================== */

  sendLocationUpdate(driverId: string, location: DriverLocationPayload) {
    this.send({
      type: "locationUpdate",
      role: "driver",
      driver: driverId,
      data: location,
    });
  }

  /* ===============================
     🔔 LISTENERS
  =============================== */

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
}

const driverSocketService = new DriverSocketService();
export default driverSocketService;
