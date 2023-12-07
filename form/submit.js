createListItem();

chrome.runtime.onMessage.addListener(async ({ error, reloadList }) => {
  if (error) alert(error);
  if (reloadList) createListItem();
});

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const txid = document.querySelector("#txid").value;
  const confirmations = document.querySelector("#confirm").value;

  await checkListItem(txid);
  createListItem();

  chrome.runtime.sendMessage({ txid, confirmations });
});

async function checkListItem(txid) {
  return new Promise(async (resolve) => {
    const storage = (await chrome.storage.local.get(["txid"])) ?? [];
    if (!storage.txid.includes(txid)) {
      storage.txid.push(txid);
      await chrome.storage.local.set({ txid: storage.txid }, () => {
        resolve();
      });
    }
  });
}

async function createListItem() {
  const listitem = document.querySelector("section");
  listitem.hidden = false;
  listitem.children[0].innerHTML = "";

  const storage = await chrome.storage.local.get(["txid"]);
  if (!storage.txid) return;

  storage.txid.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.innerHTML = `${item.substring(0, 35)}...`;
    itemElement.id = item;

    const buttonElement = document.createElement("button");
    buttonElement.className = "btnItem";
    buttonElement.innerHTML = "X";
    buttonElement.addEventListener("click", () => {
      const newStorage = storage.txid.filter((value) => value !== item);
      chrome.storage.local.set({ txid: newStorage });
      createListItem();
    });

    itemElement.appendChild(buttonElement);

    listitem.children[0].appendChild(itemElement);
  });
}
