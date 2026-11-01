import type { FeedHandler, FeedStatus, FeedUpdate, MarketFeed, MarketSymbol } from "./types";

export interface WebSocketFeedOptions {
  symbols: MarketSymbol[];
  url: string;
  /** Payload sent once the socket opens. Return null to send nothing. */
  buildSubscribeMessage?: (symbols: string[]) => unknown;
  /** Map a vendor payload to zero, one or many updates. */
  parseMessage: (payload: unknown) => FeedUpdate[];
  /** Optional keep alive so proxies do not drop an idle socket. */
  heartbeatMs?: number;
  buildHeartbeatMessage?: () => unknown;
  reconnectBaseMs?: number;
  reconnectMaxMs?: number;
}

/**
 * Vendor agnostic streaming adapter. Point it at any provider by supplying the
 * URL, the subscribe payload and a parser for that provider's message shape.
 *
 * Finnhub example, note that this provider wants the token in the query string
 * and expects a JSON subscribe frame:
 *
 *   const feed = createWebSocketFeed({
 *     url: `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`,
 *     symbols: ALL_SYMBOLS,
 *     buildSubscribeMessage: (symbols) => ({ type: "subscribe", symbol: symbols[0] }),
 *     parseMessage: (payload) => {
 *       const message = payload as { type?: string; data?: { s: string; p: number; t: number }[] };
 *       if (message.type !== "trade" || !message.data) return [];
 *       return message.data.map((trade) => ({ symbol: trade.s, price: trade.p, at: trade.t }));
 *     },
 *   });
 */
export function createWebSocketFeed(options: WebSocketFeedOptions): MarketFeed {
  const {
    symbols,
    url,
    buildSubscribeMessage,
    parseMessage,
    heartbeatMs,
    buildHeartbeatMessage,
    reconnectBaseMs = 1000,
    reconnectMaxMs = 20000,
  } = options;

  return {
    kind: "websocket",
    connect({ onUpdate, onStatus }: FeedHandler) {
      let socket: WebSocket | null = null;
      let closed = false;
      let attempt = 0;
      let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
      let heartbeatTimer: ReturnType<typeof setInterval> | undefined;

      const report = (status: FeedStatus, detail?: string) => {
        if (!closed) onStatus(status, detail);
      };

      const scheduleReconnect = () => {
        if (closed) return;
        const backoff = Math.min(reconnectMaxMs, reconnectBaseMs * 2 ** attempt);
        const jitter = backoff * 0.2 * Math.random();
        attempt += 1;
        report("stalled", `reconnecting in ${Math.round(backoff + jitter)}ms`);
        reconnectTimer = setTimeout(open, backoff + jitter);
      };

      function open() {
        report("connecting");
        socket = new WebSocket(url);

        socket.onopen = () => {
          attempt = 0;
          report("live", "websocket");
          const frame = buildSubscribeMessage?.(symbols.map((entry) => entry.symbol));
          if (frame) socket?.send(JSON.stringify(frame));

          if (heartbeatMs && buildHeartbeatMessage) {
            heartbeatTimer = setInterval(() => {
              if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(buildHeartbeatMessage()));
              }
            }, heartbeatMs);
          }
        };

        socket.onmessage = (event) => {
          if (typeof event.data !== "string") return;
          let payload: unknown;
          try {
            payload = JSON.parse(event.data);
          } catch {
            return;
          }
          for (const update of parseMessage(payload)) onUpdate(update);
        };

        socket.onerror = () => {
          report("error", "socket error");
        };

        socket.onclose = () => {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
          heartbeatTimer = undefined;
          socket = null;
          if (!closed) scheduleReconnect();
        };
      }

      open();

      return () => {
        closed = true;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        socket?.close();
        onStatus("idle");
      };
    },
  };
}
