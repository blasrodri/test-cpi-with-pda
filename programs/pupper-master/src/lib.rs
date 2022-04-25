use anchor_lang::prelude::*;
use puppet_cpi::cpi::accounts::SetData;
use puppet_cpi::program::PuppetCpi;
use puppet_cpi::{self, Data};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLns");

#[program]
pub mod pupper_master {
    use super::*;

    pub fn pull_strings(ctx: Context<PullStrings>,bump: u8, data: u16) -> Result<()> {

        let cpi_program = ctx.accounts.puppet_program.to_account_info();

        msg!("inside puppet master");

        let cpi_accounts = SetData{
            puppet: ctx.accounts.puppet.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        let bump = &[bump][..];
        puppet_cpi::cpi::set_data(cpi_ctx.with_signer(&[&[bump][..]]), data);

        

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, PuppetCpi>,
    /// CHECK:
    pub authority: UncheckedAccount<'info>
}
