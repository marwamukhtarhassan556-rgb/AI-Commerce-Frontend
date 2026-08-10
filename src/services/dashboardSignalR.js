import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

const API_URL = import.meta.env.VITE_MAIN_API_URL || 'https://aisales123.runasp.net';

const readStoreId = (value) => value?.storeId || value?.store_id || value?.StoreId || '';
const readNumber = (value, keys) => {
  for (const key of keys) {
    const number = Number(value?.[key]);
    if (Number.isFinite(number)) return number;
  }
  return undefined;
};

const normalizeRevenueUpdate = (...args) => {
  const payload = args.find((value) => value && typeof value === 'object') || {};
  const value = readNumber(payload, ['totalRevenue', 'total_revenue', 'revenue', 'value']) ?? readNumber({ value: args.find((item) => typeof item === 'number') }, ['value']);
  return { storeId: readStoreId(payload) || (typeof args[0] === 'string' ? args[0] : ''), totalRevenue: value, currency: payload.currency || payload.Currency || '' };
};

const normalizeGrowthUpdate = (...args) => {
  const payload = args.find((value) => value && typeof value === 'object') || {};
  const value = readNumber(payload, ['growthPercentage', 'growth_percentage', 'revenueGrowth', 'value']) ?? readNumber({ value: args.find((item) => typeof item === 'number') }, ['value']);
  return { storeId: readStoreId(payload) || (typeof args[0] === 'string' ? args[0] : ''), growthPercentage: value };
};

export async function connectDashboardHub({ storeId, onRevenue, onGrowth, onStatus }) {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/hubs/dashboard`, { accessTokenFactory: () => localStorage.getItem('token') || '' })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(LogLevel.Warning)
    .build();

  connection.on('ReceiveTotalRevenue', (...args) => onRevenue?.(normalizeRevenueUpdate(...args)));
  connection.on('ReceiveRevenueGrowth', (...args) => onGrowth?.(normalizeGrowthUpdate(...args)));
  connection.onreconnecting(() => onStatus?.('reconnecting'));
  connection.onreconnected(() => onStatus?.('connected'));
  connection.onclose(() => onStatus?.('offline'));

  await connection.start();
  try { await connection.invoke('JoinStore', storeId); }
  catch { await connection.invoke('JoinStoreGroup', storeId); }
  onStatus?.('connected');

  return async () => {
    if (connection.state !== HubConnectionState.Disconnected) await connection.stop();
  };
}
