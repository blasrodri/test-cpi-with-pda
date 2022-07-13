use anchor_lang::prelude::*;
use puppet_cpi::cpi::accounts::SetData;
use puppet_cpi::program::PuppetCpi;
use puppet_cpi::{self, Data};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLns");

#[program]
pub mod pupper_master {
    use super::*;

    pub fn pull_strings(
        ctx: Context<PullStrings>,
        pda_id: String,
        base_bump: u8,
        data: u16,
    ) -> Result<()> {
        msg!("making a cpi call");

        let seeds = &[
            pda_id.as_bytes()[..18].as_ref(),
            pda_id.as_bytes()[18..].as_ref(),
            &[base_bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = SetData {
            puppet: ctx.accounts.puppet_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.puppet_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        puppet_cpi::cpi::set_data(
            cpi_ctx,
            pda_id.clone(),
            base_bump,
            data
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pda_id: String, base_bump: u8)]
pub struct PullStrings<'info> {
    #[account(mut, seeds = [pda_id.as_bytes()[..18].as_ref(), pda_id.as_bytes()[18..].as_ref()],bump = base_bump, seeds::program = puppet_program.key())]
    pub puppet_account: Account<'info, Data>,
    pub puppet_program: Program<'info, PuppetCpi>,
}
