**January 31, 2022**
- in class, we decided on a team name: resol
- created the team git repository
- created first entry into personal notebook  

**February 2, 2022**
- met with instructor and TA
- researched solana and crypto

**Februrary 7, 2022**
- started on project proposal
  - began Pert chart
- created list of tasks needed for design of project
- helped brainstorm agenda for Wednesday meeting

**February 9, 2022**
- met with instructor and TA
  - decided on milestone as team: create monitoring module that check exchange rates on Mango and Raydium
  - expected day to accomplish milestone: February 28, 2022
- went through steps of running and interacting with onchain Solana helloworld program
![image](https://media.github.tamu.edu/user/13075/files/f6d24b80-89ac-11ec-9221-f19d40684a2c)

**February 12, 2022**
- worked on project proposal  
  - completed Pert chart
  - worked on design specifications

**February 13, 2022**
- completed project proposal with team  

**February 14, 2022**
- practiced project proposal presentation with team
- presented presentation
- researched getting on chain amm to return exchange rate

**February 16, 2022**
- met with instructor and TA

**February 27, 2022**:
Its been a while since the last update but heres a summary of the past 1.5 weeks:
- we created a chainlink price monitoring module last week but after meeting with TA/Prof, we decided that wasn't a good route to take
- I continued looking into a way to get good data for prices and after some research I have found coin gecko
https://blog.chain.link/levels-of-data-aggregation-in-chainlink-price-feeds/
- the above link gives a good explanation of how coin gecko and chainlink differ
- I will discuss this with the professor/ta tomorrow in class, but from my research I think some data aggregation is necessary (coin gecko) but not too much (chainlink)
- I have created a small program that returns the values of some prices of MANGO, ORCA, and RAYDIUM against USD using the coin gecko API that I plan to demo in class tomorrow for the TA/Prof
- hopefully this is a promising first start to the price monitoring module
  - (we will find out tomorrow)
  
**March 1, 2022**  
- Looked into other methods for price monitoring due to CoinGecko taking so long for price returns
- Created a program based off a github (https://github.com/sonarwatch/serum-price-api) that calls Raydium and Serum Amms directly to get prices
- This program collects data from recents transactions to get the price
- I feel like this is promising

**March 2, 2022**
- completed peer eval
- met with prof/ta today
- worked with Grant all class trying to send a transaction to raydium
- spent the rest of the day trying to create and place an order with little luck
- hoping for some more luck tomorrow

**March 4, 2022**
- met with Grant for about 3 hours and for about 3 more hours later Friday night
  - set up some basic logic for the price monitoring module between Serum and Orca
  - worked on trying to set up transactions through serum
  - started looking into Anchor for on chain programs

**March 6, 2022**
- met with Grant and Anu for about 4 hours and for a couple more later Sunday night
  - Able to get orca transactions to send with a Solana instruction and Jupiter working
- continued to look into Anchor more, following some of their tutorials
  - aim is to get small on chain program that can send a transaction
  - another aim is to get price monitoring module to notify the on chain program

**March 7, 2022**
- in class managed to set up basic on chain program using Anchor
  - price monitoring module is able to call function in on chain program 
  - on chain function just prints a message

**March 9, 2022**
- met with Prof and TA and discussed expectations for CDR after spring break
- spent time with Grant trying to get serum swap instruction working in order to include Raydium in our transaction module

**March 16, 2022**
- met with team this evening to plan out tasks for the next couple days regarding CDR
- tried to understand as a team why Jupiter executeSwap function wasnt completing

**March 21, 2022**
- since last update, worked with team on the CDR presentation and report
- worked with Grant to get demo ready
  - specifically worked on getting token amount from wallet to display gains/losses
- today, met with team before class to practice presentation
- presented CDR and Demo to class

**March 30, 2022**
- spent a lot of time trying to get on chain function with Anchor working
  - specifically trying to pass transaction information into an onchain function
- shifted to not using Anchor, and instead trying to make an onchain function using C
- met with Prof and TA in class
  - decided to focus more off chain and trying to make a profit with Jupiter price routes
- worked with Grant and Robert on getting sendTransaction instruction working with the transactions returned from Jupiter

**April 6, 2022**
- in the past week, played around with the Jupiter price routes to try to maximize profit
  - started looking at price routes from SOL -> SOL
  - Grant noticed that when sweeping price routes from SOL->SOL, sometimes the outAmount would be larger than the inAmount
  - we decided to try to target these scenarios to only make transactions when the outAmount was larger than the inAmount
- met with Prof and TA in class
  - had a long discussion about Jupiter and how we use it to make transactions, as well as how much we are risking during our trades
  - decided to shift my focus towards trying to get a simple proof of concept up by next week to prove that we can make transactions without the help of Jupiter
- due to the higher risk we want to add to our trading, I decided to set up a Coinbase account and transfer some money into it so that I can have more SOL to trade
  - I need to wait 7 days to be able to send the money to my wallet that I use to trade with

**April 12, 2022**
- spent a lot of time over the weekend looking into how Jupiter creates the swap transactions that we've been using to try to get a better understanding of what they're doing
  - in the process of that, I found that Jupiter also offers an instruction parser
    - spent some time getting the parser working, several edits were needed to the code for it to compile
    - used the parser to parse through the transactions that Jupiter produces for us
    - this gave me a better idea of what the transactions contained:
      - programID of JupiterAggregator, meaning that every transaction we send that was made by Jupiter is going to Jupiter's onchain function, instead of directly to an amm's onchain function
      - several public keys
      - data that included amountIn and minimumAmountOut
    - also discovered why I was losing so much money with some of the Jupiter transactions-sometimes part of the transaction that sent SOL to Jupiter was in the first transaction, and the second transaction would fail... this means that it wasn't atomic
       - However, Jupiters transactions are usually atomic, just not always
- After speaking with the team in class, yesterday and today I spent a lot of time trying to get Raydium Swaps to work through Raydium
   - Very excitingly, I was able to get a swap working this evening where I send OXY to Raydium and it sends back RAY
   - Grant said he would try to get a little demo together with Orca (already previously got swaps on Orca to work) and Raydium to show the Prof and TA tomorrow during our meeting
   - Although we have these working, I still believe Jupiter will give us a higher chance at profit, we just wanted to show that we can indeed make and send successful atomic transactions without the help Jupiter
