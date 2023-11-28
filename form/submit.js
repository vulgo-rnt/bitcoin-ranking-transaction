document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const txid = document.querySelector("#txid").value;
  const confirmations = document.querySelector("#confirm").value;
  chrome.runtime.sendMessage({ txid, confirmations });
  alert("Notification Created");
});
