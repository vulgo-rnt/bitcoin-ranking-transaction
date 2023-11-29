const previousData = { txix: "", confirmed: false };

chrome.runtime.onMessage.addListener(({ txid, confirmations }) => {
  checkConfirmations(txid, confirmations);
});

async function checkConfirmations(txid, confirmations) {
  if (previousData.txid === txid && previousData.confirmed === true) {
    await removeToList(txid);
    chrome.runtime.sendMessage({ error: "tx confirmed", reloadList: true });
    return;
  }
  if (previousData.txid === txid) return;

  previousData.txid = txid;
  previousData.confirmed = false;

  fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txid}`)
    .then((data) => data.json())
    .then(async (data) => {
      if (data.error) {
        await removeToList(txid);
        chrome.runtime.sendMessage({ error: data.error, reloadList: true });
      } else if (data.confirmations >= confirmations) {
        previousData.confirmed = true;
        sendMessageNotification(data);
        chrome.runtime.sendMessage({ reloadList: true });
      } else {
        createWs(txid, confirmations);
        chrome.runtime.sendMessage({ reloadList: true });
      }
    });
}

function createWs(txid, confirmations) {
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
  removeToList(tx.hash);
  previousData.confirmed = true;
  const options = {
    body: `
    Confirmations Block : ${tx.confirmations}`,
  };
  self.registration.showNotification("Approved Transaction", options);
}

async function removeToList(txid) {
  return new Promise(async (resolve) => {
    const storage = await chrome.storage.local.get(["txid"]);
    const index = storage.txid.indexOf(txid);
    storage.txid.splice(index, 1);
    await chrome.storage.local.set({ txid: storage.txid });
    resolve();
  });
}
