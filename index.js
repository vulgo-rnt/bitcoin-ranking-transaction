document.querySelector("#btnAlarm").addEventListener("click", () => {
  const txid = document.querySelector("#txid").value;
  const confirmations = document.querySelector("#confirm").value;
  chrome.runtime.sendMessage({ txid, confirmations });
});
