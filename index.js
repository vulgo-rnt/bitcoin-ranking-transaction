import Cryptoapis from "cryptoapis";
import "dotenv/config";

const defaultClient = Cryptoapis.ApiClient.instance;

const ApiKey = defaultClient.authentications["ApiKey"];
ApiKey.apiKey = process.env.API_KEY;

const apiInstance = new Cryptoapis.CallbackDataApi();
const blockchain = "bitcoin";
const network = "testnet";
const transactionId = process.argv[2];

apiInstance
  .getTransactionDetailsByTransactionIDFromCallback(
    blockchain,
    network,
    transactionId
  )
  .then(
    (data) => {
      console.log("API called successfully. Returned data: " + data);
    },
    (error) => {
      console.error(error);
    }
  );
