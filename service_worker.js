chrome.runtime.onMessage.addListener(({ txid, confirmations }) => {
  createWs(txid, confirmations);
});

async function createWs(txid, confirmations) {
  const ws = new WebSocket(
    `wss://socket.blockcypher.com/v1/btc/main?token=0a05df34698542dbba64d037419d3a5b/tx/${txid}`
  );

  ws.onmessage = (event) => {
    const tx = JSON.parse(event.data);
    console.log(tx);
  };
  ws.onopen = (event) => {
    ws.send(JSON.stringify({ event: "tx-confirmation" }));
  };
}
