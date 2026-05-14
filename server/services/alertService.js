/**
 * Alert Service
 * Handles notifications and broadcasting of trading signals
 */

let socketIo = null;

export function initAlertService(io) {
  socketIo = io;
  console.log('✅ Alert service initialized with WebSocket');
}

export function broadcastNewSignal(signal) {
  if (socketIo) {
    socketIo.emit('signal:new', {
      id: signal.id,
      symbol: signal.symbol,
      entry_price: signal.entry_price,
      target_price: signal.target_price,
      stop_loss: signal.stop_loss,
      signal_type: signal.signal_type,
      confidence: signal.confidence_score,
      posted_at: signal.posted_at,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Broadcasted new signal: ${signal.symbol}`);
  }
}

export function broadcastSignalResult(signalId, result) {
  if (socketIo) {
    socketIo.emit('signal:result', {
      id: signalId,
      result: result,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Broadcasted signal result: ${signalId} - ${result}`);
  }
}

export function broadcastPerformanceUpdate(stats) {
  if (socketIo) {
    socketIo.emit('performance:update', {
      ...stats,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Broadcasted performance update`);
  }
}

export function broadcastAlert(alert) {
  if (socketIo) {
    socketIo.emit('alert', {
      id: alert.id,
      type: alert.alert_type,
      message: alert.message,
      timestamp: new Date().toISOString()
    });
    console.log(`🔔 Broadcasted alert: ${alert.message}`);
  }
}
