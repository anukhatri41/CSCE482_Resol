<h4>1/31/22</h4>

Brainstormed names, did solana research.


<h4>2/2/22</h4>

Met with Dr. Huang and Laren, cleared up our confusion we had about how we should think about our project 
as well as the idea behind our implementation. Clarified what it means to work on the blockchain, as well as how we can begin to start our development.

Drew out our ideas, got a high level understanding of what we need to do, what we need to research for next class.


<h4>2/7/22</h4>

Today we started working on our project proposal, looking at our weekly report we need to work on, and started to experiment with Solana.

We created a paper wallet, which we were able to modify the balance of, and check the balance from other computers.

When working on our project proposal, we started to think:
- What we would need in terms of hardware, hosting, etc?
- How we would deploy our code on the blockchain?
- What is the scope of our project?
- How are we going to handle hosting our monitoring software?

We had team bonding time as well after we firmed up some of the details about our project.

<h4>2/9/22</h4>

Today we met with the professor, discussed what our focus should be, and narrowed down what our first milestone should be.

We decided to have aim for 2/28/22 for our first milestone. Our first milestone consists of creating a basic version of our planned monitoring software.

Our plans for our monitoring software include:
- Multiple threads utilized to monitor currency pair pricing
- Use Raydium and Mango (both Solana AMM's) to monitor first
- Monitor SOL/USDC price

This is our minimal viable product, and we decided to aim to complete this by 2/28/22, that way we have a couple cushion days before we meet with Dr. Huang and Laren.

<h4>2/14/22</h4>

Today we gave our presentation.

Additionally, we did a lot of research and began experimenting with actually using Solana, so we can get an idea of what is happening.

I have a little bit of SOL in my coinbase account, so as a group, we moved the SOL into a chrome based wallet, and connected it
with one of the AMM's we are planning to use, Raydium. We did not make any purchases, but we moved the SOL between coinbase and the chrome wallet, connected the
wallet, and viewed things such as the how pricing flucuates, the speed of a SOL transaction, etc.

We also began exploring serum and anchor. We now understand, at least in theory, how we are supposed to go about interacting with the blockchain,
and have been looking over tutorials about how to send instructions in blockchain transactions. We also have been utilizing solscan to see the addresses that things like Raydium use to make transactions.

<h4>2/16/22</h4>

Today we had our weekly meeting with Dr.Huang. We also learned that Raydium does not have the best documentation, so we decided to use Sabre for now, we are still exploring our options. We are definitely going to use Mango, and have been looking at what our options are when doing this project. 

One thing I have been doing, is trying to figure out how I can ping Mangos pools. It is one of our short term goals to simply be able to buy and sell 
some SOL just through code and API's/Blockchain commands.

It was productive, and I was able to learn a little more about the hello world, as well as see my devnet on the Solana explorer. I was redoing the helloworld
because I want to get a better understanding of the code and what it is doing.

<h4>2/20/22</h4>

Attempted to figure out how to deploy a program.

Followed an online tutorial, and now have pricing data avaliable, however it is not exchange specific.

Working towards getting exchange specific data, hopefully can have this done before class tomorrow.

<h4>2/21/22</h4>

Today we continued to work on trying to get specific exchange data, while also splitting into smaller groups to begin working on different parts of our code so we can hopefully have something to show Dr.Huang.

I have currently been working on modifying the hello world code given by solana based on various tutorials to be able to get a transaction to go through.

Unfortunatly at this point I still have been unable to get the code fully working, however I am hoping that by either the end of today or tomorrow I can
have more progress to report.

<h4>2/23/22</h4>

After our meeting with Dr. Huang and Laren, we contiued to dive deep into what we needed to do. Between today and Monday I had done a lot of work trying to fully grasp what it is that we need to do. I think after my research and our meeting today, we at least fully understand what we need.

We have been trying extremely hard to get what Dr. Huang wanted us to do to work, which was modify some basic code to just send some transaction to an AMM. However, we are really struggling to find the exact instruction set we need to send to the correct solana address.
We think we may have found soemthing due from serum that will allow us to actually see the backend of an AMM, because many of the AMM's (if not all of them), use serum, or at least thats what we have seen.

After today, we are going to continue working, we are feeling pretty discouraged because we have been trying extremely hard to get this stuff to work, but we just can't seem to find our footing, hopefully something changes so we get a little confidence boost.

<h4>2/25/22</h4>

I dedicated pretty much my entire day to just sitting down and trying to figure out what we need to do. On one hand, I have gotten a much better understanding of the client side of things. I modified the hello world program to allow me to send some text instead of just that incrementing thing.

While this may sound basic, I think these are important steps that will allow us to push forward when we have a bigger break through. We are still trying to get the code working that just allows us to interact with an AMM, but I think we are definitely getting much closer. 

In addition to working most of the day today, I also have cleared off my schedule on Sunday, 2/27/22, to focus as much as I can on that. We are planning to meet as a group as well to try to get some work done.

<h4>2/27/22</h4>

Today we met up at one. Veronica has made some good progess on the price monitoring side of things, she has found a good api from coingecko.com that allows for us to see the different prices of currency pairs on different AMM's. I continued working on trying to be able to send a transaction. I have set up an SPL wallet through Sollet that I believe will allow me to access the wallet credentials I need to send actual SOL, not just paper money.

Update: Some time has passed since our meeting, and fortunantely I have been able to send actual real SOL on the mainnet-beta network between accounts. This is unbelievebly exciting for us! This is definitely the confidence boost we needed!

I have been sending money between a Sollet and Phantom account. The Sollet account acts as the sender account, as it allows me easy access to the private secret key neccessary to send the SOL. The Phantom account I believe allows access to private key stuff as well, but Sollet seems to update much quicker than Phantom. Also Sollet has a nice UI for devnet stuff, but it doesn't show previous transactions.
 
 Anyways, point is, we finally got somewhere! Yay! Hopefully we can keep that progress up.

 <h4>2/28/22</h4>

 Today we got a lot of work done. We sifted through a lot of the repositories and documentation, and I think we found some documentation that will be useful in showing us how we can connect to the markets using js.

 I accidently uploaded my secret key to one of my Solana wallets, but I did that this morning before class, so I was able to go back and fix all of that before class started.

 Veronica has made a lot of progress with the price monitoring side of things, and hopefully once I get this market part figured out, we can work on integrating it.

 We are very hopeful and are planning to have something we can actually show Laren & Dr.Huang. I have set aside a lot of time today and tomorrow to hopefully get that to work.

 <h4>3/1/22</h4>

 Today I have spent a lot of time working on the buying side of the project. I have begun to use raydium SDK, instead of the serum SDK. Unfortunantly as of right now, I cannot get it to work. Due to issues from the poor raydium documentation along with my lack of understanding of typescript, I cannot seem to understand how to make this work.

 I will of course continue this work, however I am slightly disappointed as we had hoped to have something on the buy side to be able to show to Laren and Dr. Huang. I know Veronica has made some excellent progress on the price fetching side.

 Perhaps I will ask Dr. Huang how he goes about reading this documentation and maybe pick his brain to ask him what some of these properties mean when working with the Raydium SDK.

 <h4>3/2/22</h4>

 Today we met with Dr. Huang and we spoke to him about our struggles finding an exchange with proper documentation. We had a demonstration to show him of our price monitoring module, but we never ended up showing it to him.

 After our meeting with Dr. Huang and Laren, we began to work on some of the example code. We split into two different teams, me and Veronica, and Anu and Robert. Me and Veronica were trying to send an instruction over the Solana network instead of through an exchanges API. Anu and Robert were working on getting the mango example code to run.

 We are confident we are on the right track, we are just having so many stuggles finding the proper documentation to get us there.

 <h4>3/4/22<h4>

 Today me and Veronica met up to work on the project. 

 We finally made some more meaningful progress! We were able to do a transaction with the Orca exchange!

 Veronica was specifically working on trying to get pricing from the Orca and Mango exchange, which I believe she succeeded in doing.

 I was trying to get us to be able to purchase something, which I was able to do through Orca's API. Our next step is to try to do it through Solana instructions.

 I will continue working on this more this weekend.

 <h4>3/6/22</h4>

Today, we met up and began working on our swapping program. We were able to contrust a transaction and send it through solana using the orca exchange!

This is super exciting for us, we have been trying to get this to work for the longest time. From here, we want to try to find one more exchange we can do a transaction with. Currently we have been trying to use Jupiter, but we are having getting it to do a transaction with anything that isn't USDC to USDT.

<h4>3/7/22</h4>

Today, we continued working with Jupiter, and we are having trouble verifying transactions right now because apparently, according to Jupiter at least, the Solana network is experiencing some issues at the moment. We will continue to work on this later.

On the bright side, now that we have orca working with the Solana commands instead of just through their API, we are now trying to figure out how to replicate a similar transaction through any other exchange. 

Once we get that working, we believe it will be pretty straight forward to connect with our monitoring program that Veronica has been working on.

Moving forward the main things we need are to be able to do a transaction with one more exchange, integrate our price monitoring and client side programs, and then
we have our MVP. Exciting!

<h4>3/8/22</h4>

Today I was working on trying to get serum to work because we found some people on discord mentioning that it should work, but to no avail. Ill try again tomorrow in class.


<h4>3/9/22</h4>

Today we met with Dr. Huang and Laren. We showed them what we have so far, which is only Orca running, and they basically told us that we are on the right track. We are slightly disappointed in ourselves because we really do wish we had more at this point, but it has just been insanely difficult to get anything working. We strongly feel like the amount of work we have to show is not representative of the hours we have put in.

After our meeting, me and Veronica did a lot of work trying to get raydium to work because we found some more information on liquidity pools. Hopefully, we can use this to really get something going, however by the end of class, we still dont have anything working. I will continue working more on this tomorrow and have allocated basically most of my spring break to work on this project.