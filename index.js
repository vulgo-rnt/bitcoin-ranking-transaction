const txid = document.querySelector("#txid").value;
const confirmations = document.querySelector("#confirm").value;

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.alarms.create("fecth", { periodInMinutes: 0.2 });
});

document.querySelector("#btnAlarm").addEventListener("click", () => {
  createFetchInterval();
});

function createFetchInterval() {}
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fecth") {
    console.log("...");
  }
});

async function findConfirmations() {
  const res = await fetch(
    `https://api.blockcypher.com/v1/btc/main/txs/${txid}`
  );
  return res.data.confirmations;
}
