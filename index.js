import mempoolJS from "@mempool/mempool.js";

const init = async () => {
  const {
    bitcoin: { transactions },
  } = mempoolJS({
    hostname: "mempoolhqx4isw62xs7abwphsq7ldayuidyx2v2oethdhhj6mlo2r6ad.onion",
  });

  const txid =
    "52538217af08b4dfa6c7b19aac4b67dd0293521cbc2cb0acf30289d3bf9fa31c";
  const txStatus = await transactions.getTxStatus({ txid });
  console.log(txStatus);
};

init();
