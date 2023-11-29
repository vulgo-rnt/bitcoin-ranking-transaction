createListItem();

chrome.runtime.onMessage.addListener(({ error, sucessfully }) => {
  if (error) alert(error);
  if (sucessfully) {
    removeToList(sucessfully.txid);
    createListItem();
  }
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const txid = document.querySelector("#txid").value;
  const confirmations = document.querySelector("#confirm").value;

  checkListItem(txid);
  createListItem();

  chrome.runtime.sendMessage({ txid, confirmations });
});

function checkListItem(txid) {
  const storage = JSON.parse(localStorage.getItem("txid")) || [];

  if (!storage.includes(txid)) {
    storage.push(txid);
    const data = JSON.stringify(storage);
    localStorage.setItem("txid", data);
  }
}

function createListItem() {
  const listitem = document.querySelector("section");
  listitem.hidden = false;
  listitem.children[0].innerHTML = "";

  const storage = JSON.parse(localStorage.getItem("txid"));
  console.log(storage);

  if (storage === null) return;

  storage.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.innerHTML = `${item.substring(0, 9)}...`;
    itemElement.id = item;

    // const buttonElement = document.createElement("button");
    // buttonElement.addEventListener("click", (event) => {
    //   const storage = JSON.parse(localStorage.getItem("txid"));
    //   const index = storage.indexOf(event.target.id);
    //   storage.splice(index, 1);

    //   localStorage.setItem("txid", JSON.stringify(storage));
    //   console.log(event);
    // });

    // itemElement.appendChild(buttonElement);

    listitem.children[0].appendChild(itemElement);
  });
}

function removeToList(txid) {
  const storage = JSON.parse(localStorage.getItem("txid"));
  const index = storage.indexOf(txid);
  storage.splice(index, 1);
  localStorage.setItem("txid", JSON.stringify(storage));
}
