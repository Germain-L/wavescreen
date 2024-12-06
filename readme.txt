The objective of this project is to build a robot that listen to some parts of the solana network, to select good token, to buy and sell them.

There 3 solutions to listen to what happen on solana:
- webhooks
- websockets
- rpc
READ: https://docs.helius.dev/data-streaming/webhooks

We use webhooks because it's flexible and simple; the only thing to consider is a the number of calls: it's $5 for 5 millions hooks send.
READ: https://docs.helius.dev/welcome/pricing-and-rate-limits#credits

We need to use https://tunnelto.dev/ to get webhhooks be redirected to our local server.

