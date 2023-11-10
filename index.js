import Cryptoapis from "cryptoapis";
import "dotenv/config";

const defaultClient = Cryptoapis.ApiClient.instance;

const ApiKey = defaultClient.authentications["ApiKey"];
ApiKey.apiKey = process.env.API_KEY;

const apiInstance = new Cryptoapis.UnifiedEndpointsApi();
const blockchain = "bitcoin";
const network = "testnet";
const transactionId = process.argv[2];

apiInstance
  .getTransactionDetailsByTransactionID(blockchain, network, transactionId)
  .then(
    (data) => {
      console.log(data);
    },
    (error) => {
      console.error(error);
    }
  );
