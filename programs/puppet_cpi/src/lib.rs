use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod puppet_cpi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _pda_id: String, authority: Pubkey) -> Result<()> {
        ctx.accounts.puppet.authority = authority;
        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, _pda_id: String, _base_bump: u8, data: u16) -> Result<()> {

        let puppet = &mut ctx.accounts.puppet;
        puppet.data = data;

        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(pda_id: String)]
pub struct Initialize<'info> {
    #[account(init, payer = user, seeds = [pda_id.as_bytes()[..18].as_ref(), pda_id.as_bytes()[18..].as_ref()],bump, space = 9000)]
    pub puppet: Account<'info, Data>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}
#[derive(Accounts)]
#[instruction(pda_id: String, base_bump: u8)]
pub struct SetData<'info> {
    #[account(mut, seeds = [pda_id.as_bytes()[..18].as_ref(), pda_id.as_bytes()[18..].as_ref()],bump = base_bump)]
    pub puppet: Account<'info, Data>,
}

#[account]
pub struct Data{
    pub data: u16,
    pub authority: Pubkey
}