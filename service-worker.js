let previousTxId;

chrome.runtime.onMessage.addListener(({ txid, confirmations }) => {
  checkConfirmations(txid, confirmations);
});

function checkConfirmations(txid, confirmations) {
  if (previousTxId === txid) return;

  fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txid}`)
    .then((data) => data.json())
    .then((data) => {
      if (data.confirmations >= confirmations) {
        sendMessageNotification(data);
      } else {
        createWs(txid, confirmations);
      }
      previousTxId = txid;
    });
}

function createWs(txid, confirmations) {
  if (txid === previousTxId) return;

  const ws = new WebSocket(
    `wss://socket.blockcypher.com/v1/btc/main?token=0a05df34698542dbba64d037419d3a5b`
  );

  ws.onmessage = (event) => {
    const tx = JSON.parse(event.data);
    sendMessageNotification(tx);
    ws.close();
  };
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        event: "tx-confirmation",
        confirmations: Number(confirmations),
        hash: txid,
      })
    );
  };
  ws.onerror = (error) => {
    console.error("Error connection WebSocket:", error);
  };

  ws.onclose = (event) => {
    console.log("Connection WebSocket closed:", event.code);
  };
}

function sendMessageNotification(tx) {
  const options = {
    body: `
    Confirmations Block : ${tx.confirmations}`,
  };
  self.registration.showNotification("Approved Transaction", options);
}
