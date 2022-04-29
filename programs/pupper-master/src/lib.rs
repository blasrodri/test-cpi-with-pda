use anchor_lang::prelude::*;
use puppet_cpi::cpi::accounts::SetData;
use puppet_cpi::program::PuppetCpi;
use puppet_cpi::{self, Data};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLns");

#[program]
pub mod pupper_master {
    use super::*;

    pub fn pull_strings(ctx: Context<PullStrings>, bump: u8, data: u16) -> Result<()> {
        let cpi_program = ctx.accounts.puppet_program.to_account_info();

        // msg!(&*user.to_account_info().key.to_string());

        let user = &mut ctx.accounts.puppet;

        let key = *user.to_account_info().key;

        msg!("inside puppet master");

        let cpi_accounts = SetData {
            puppet: ctx.accounts.puppet.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let seeds = &[&[b"first", key.as_ref(), bytemuck::bytes_of(&bump)][..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds);
        puppet_cpi::cpi::set_data(cpi_ctx, data);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, PuppetCpi>,
    /// CHECK:
    pub authority: UncheckedAccount<'info>,
}
