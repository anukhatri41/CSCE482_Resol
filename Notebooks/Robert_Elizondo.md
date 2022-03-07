# 1/31/22  
Worked on brainstorming the name for the project.  
Researched more into blockchain tech and Solana.  
   
# 2/02/22    
Meeting with Dr.Huang and Laren  
Sketching out overall project architecture  
Formulated an early version of the steps required:  
1. Set up Solana paper wallet  
2. Market price monitor (C++)  
3. Transaction function on Solana  
4. Function to envoke transaction function  
5. Front end to show analytics 
6. Test  
  
Came up with early verstion of tech stack:  
- C++ for market monitor   
- JS (Electron) for front end  
- C++ for transaction function  

# 2/07/22  
Worked on project proposal  
Set up paper wallet on Solana  
Added a balance to paper wallet  
  
# 2/09/22  
Meeting with Dr.Huang and Laren  
Came up with first milestones:  
- Hello world with Solana  
- Monitor between two DEX (Raydium and Mango) for one coin pair (SOL/USDC)  
  
# 2/14/22  
Presenetation  
Working on connecting and interfacing with different DEX  
  
# 2/16/22  
Meeting with Laren and Dr. Huang  
Try to connect with Raydium during meeting  
Found that it is difficult to interact with Raydium  
Searching for alternative DEX to use:
- Mango  
- Saber  
  
Both of these have APIs that will allow us to make small testing transactions  
Discussed onchain vs local AMM monitoring  
Learning basic Rust and Smart Contracts  
  
# 2/21/22  
Taking a step back and trying to fully understand the Hello World program becasuse I feel that is will be more beneficial to actually understand how the code is working  
Trying to figure out how the client is acessing the data from the server(counter) and trying to send a message instead of number but having erros with the borsh serializer  
  

# 2/23/22  
Meeting with Laren and Dr. Huang  
Learned more about making a custom transaction  
Followed guide: https://discord.com/channels/941045996035649587/941045996564119554/947596296825503774  
Now succesfully sent custom transaction that will do certain things based on the transaction data  
  
# 2/28/22  
Meet with group on Sunday to discuss next steps and what to focus on  
Updated progress with group from the weekend  
Can successfully send SOL to a Phantom Wallet  
Working on using Borsh to send and recieve data  
    
# 3/02/22  
Meeting with Laren and Dr. Huang  
Found out how to send custom instrction data  
Team is working on making transaction  
Starting to look into orca and using examples  
  
# 3/07/22  
Meet with group on Sunday to discuss next steps and what to focus on and figuring out which DEX to use
Able to purchase SOL through Orca  
Working on making Jupiter or Mango to succesfully send a transaction  
Workin on getting transaction on chain