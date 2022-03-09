use anchor_lang::prelude::*;
// use serum::program::

use solana_program::program::invoke;
use solana_sdk::transaction::Transaction;
use solana_sdk::signature::{Signature, Signer};
// use solana_program::system_instruction;
// use transact::protocol::transaction;
// use solana_send_transaction_service::send_transaction;
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod transaction_mod {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }

    pub fn print(ctx: Context<Print>) -> ProgramResult {
        // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        // system_instruction(cpi_ctx, data)
        msg!("ON CHAIN: buy orca USDC with SOL, sell serum USDC for SOL");

        Ok(())
        // invoke(swapPayload)

    }

    // pub fn sendOrcaTx(ctx: Context<SendOrcaTx>) -> ProgramResult {
    //     // send_transaction()
    //     invoke_signed_unchecked(ctx.tx,ctx.accounts.transaction_mod.to_account_info(), ctx.signers);
    // }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct SendOrcaTx<'info> {
    // #[account(mut)]
    pub tx: Transaction,
    pub signers: [Signer],
}

#[derive(Accounts)]
pub struct Print {}


// #region core
// use anchor_lang::prelude::*;
// use puppet::cpi::accounts::SetData;
// use puppet::program::Puppet;
// use puppet::{self, Data};

// declare_id!("HmbTLCmaGvZhKnn1Zfa1JVnp7vkMV4DYVxPLWBVoN65L");

// #[program]
// mod puppet_master {
//     use super::*;
//     pub fn pull_strings(ctx: Context<PullStrings>, data: u64) -> anchor_lang::Result<()> {
//         let cpi_program = ctx.accounts.puppet_program.to_account_info();
//         let cpi_accounts = SetData {
//             puppet: ctx.accounts.puppet.to_account_info(),
//         };
//         let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
//         puppet::cpi::set_data(cpi_ctx, data)
//     }
// }

// #[derive(Accounts)]
// pub struct PullStrings<'info> {
//     #[account(mut)]
//     pub puppet: Account<'info, Data>,
//     pub puppet_program: Program<'info, Puppet>,
// }
// // #endregion core
