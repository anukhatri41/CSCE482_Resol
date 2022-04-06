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

# 3/09/22  
Missed class due to family emergency  
Got meeting notes from teammates

# 3/23/22  
Meeting with group on Sunday to work on CDR  
Meeting with Dr.Huang and Laren  
Working on logging transactions and testing enviroment  
  
# 3/28/22
Worked on testing during the weekend and figuring out which function works best (Sol->Oxy or Oxy->Sol)  
Found that Sol->Oxy is a bit more consistent  
Working on gathering data to log and store transactions  
  
# 3/30/22  
Meeting with Dr.Huang and Laren  
Able to write transactions to a log file  
Able to read transactions from log file and analyize proformace  
Continuing to run and gather info about the two transactions  
Discussing how to pivot strategies to what Dr.Huang recommended (staying off chain but gathering forward and backward routes seperatly)

# 4/04/22  
Discussed plans for moving forward  
Created functions for parsing data from log file in order to use that data on front end  
Working on front end to use the data that we are collecting  
Found a way to visually represent our data in a usefull manner that shows preformace (controll chart)  
Going to create a demo chart for next meeting with Dr.Huang and Laren  
  
# 4/06/22  
Meeting with Dr.Huang and Laren  
Testing Sol to Sol strategy