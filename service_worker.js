chrome.runtime.onMessage.addListener(({ txid, confirmations }) => {
  console.log(txid);
});

async function findConfirmations(txid) {
  const res = await fetch(
    `https://api.blockcypher.com/v1/btc/main/txs/${txid}`
  );
  return res.data.confirmations;
}
