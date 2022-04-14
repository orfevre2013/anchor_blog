use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod blog {
    use super::*;
    pub fn create_blog(ctx: Context<CreateBlog>, name: String, post_count: u8 ) -> ProgramResult {
        ctx.accounts.blog_account.name = name;
        ctx.accounts.blog_account.post_count = post_count;
        ctx.accounts.blog_account.authority = *ctx.accounts.authority.to_account_info().key;
        Ok(())
    }
    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> ProgramResult {
        ctx.accounts.post_account.title = title;
        ctx.accounts.post_account.content = content;
        ctx.accounts.post_account.authority = *ctx.accounts.authority.to_account_info().key;
        ctx.accounts.blog_account.post_count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, post_count: u8 )]
pub struct CreateBlog<'info> {
    #[account(
        init,
        payer = authority,
        space = 250
    )]
    blog_account: Account<'info, Blog>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, body: String)]
pub struct CreatePost<'info> {
    #[account(mut)]
    pub blog_account: Account<'info, Blog>,
    #[account(
        init,
        payer = authority,
        space = 2750
    )]
    pub post_account: Account<'info, Post>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct Blog {
    pub name: String,
    pub post_count: u8,
    pub authority: Pubkey,
}
#[account]
#[derive(Default)]
pub struct Post {
    pub title: String,
    pub content: String,
    pub authority: Pubkey,
}





 