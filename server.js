import {
  TransactionType,
  WebhookType,
  Address,
  Helius,
} from "helius-sdk";
import http from 'http';
import express from "express"
import bodyParser from "body-parser"

const app = express()
const PORT = 3000
const AUTH_TOKEN = "AD7iYttHGiXqiERQ5W_muCvy8VYNEng6DZAiic2BSBizeEdI7dHdfVFRT9NjEHm"

app.use(bodyParser.json())
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
app.post("/webhooks", (req, res) => {
  console.log(`------------------------------------------ 1`)
  if (req.headers["authorization"] != AUTH_TOKEN) return

  console.log(`------------------------------------------ 2`)
  console.log(req.body[0])
  res.status(200).end()
})

// const server = http.createServer((req, res) => {
//   // À chaque requête vers le serveur, ce code sera exécuté
//   console.log("receive info", req.body)
//   res.end();
// });

// server.listen(3000, () => {
//   console.log('Serveur démarré sur http://localhost:3000');
// });


// Replace YOUR_API_KEY with the API key from your Helius dashboard
const helius = new Helius("500a609c-0e02-4203-9e77-68bb0ee3ebe9");


const createHeliosWebhook = async () => {
  console.log("createHeliosWebhook")
  const response = await helius.createWebhook({
    accountAddresses: [
      // Address.RAYDIUM_LIQUIDITY_POOL_V2,
      // Address.RAYDIUM_LIQUIDITY_POOL_V3,
      // Address.RAYDIUM_LIQUIDITY_POOL_V4,
      // Address.ra
      // "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" // pump.fun address
      Address.SQUADS
    ],
    authHeader: AUTH_TOKEN,
    webhookURL: "https://holy42test.tunn.dev/webhooks",
    webhookType: WebhookType.RAW,
    transactionTypes: [TransactionType.ANY],
  });

  console.log(response)
  console.log("createHeliosWebhook DONE")
}
// createHeliosWebhook()


const getTokensByOwner = async owner => {
  const response = await helius.rpc.getTokenAccounts({
    page: 1,
    limit: 100,
    options: {
      showZeroBalance: false,
    },
    owner: owner
  });

  console.log(response.token_accounts.map(token => token.mint));
}

// const getTokenHolders = async (tokenMintAdress) => {
//   const response = await helius.rpc.getTokenHolders(tokenMintAdress);
//   console.log(response.items.map(item => item.mint));
// }

// getTokensByOwner("89WutxpkfHgex82PuBMpXN242bNEEmVmtcaE5Sm3zo1k");