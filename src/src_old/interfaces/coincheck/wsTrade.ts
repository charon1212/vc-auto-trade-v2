import * as websocket from 'websocket'
import { Pair } from '../../type/coincheck';

type Param = {
  pair: Pair,
  received: (data: { id: number, pair: string, rate: string, amount: string, buySell: 'buy' | 'sell' }) => unknown,
  onError?: (type: 'connectFailed' | 'connectionError', error: Error) => unknown,
};
export const websocketTradeStart = (params: Param) => {

  const { pair, received, onError } = params;

  const client = new websocket.client();

  client.on('connectFailed', (error) => {
    onError ? onError('connectFailed', error) : console.log('connection failed');
  });

  client.on('connect', (conn) => {

    conn.on('error', (error) => {
      onError ? onError('connectionError', error) : console.log('connection error');
    });
    conn.on('close', () => console.log('connection closed'));
    conn.on('message', (message) => {
      if (message.type !== 'utf8') return;
      const messageObj = JSON.parse(message.utf8Data);
      received({ id: messageObj[0], pair: messageObj[1], rate: messageObj[2], amount: messageObj[3], buySell: messageObj[4], });
    });

    const send = () => {
      if (conn.connected) {
        const message = { type: 'subscribe', channel: `${pair}-trades`, };
        conn.send(JSON.stringify(message));
        setTimeout(send, 1000); // 1秒ごとに再送信
      }
    };
    send();

  });

  client.connect('wss://ws-api.coincheck.com/', 'echo-protocol');

};
