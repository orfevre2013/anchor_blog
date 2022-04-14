import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Blog } from '../target/types/blog';
import * as assert from "assert";

describe('blog', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Blog as Program<Blog>;
  const blog = anchor.web3.Keypair.generate()
  const post = anchor.web3.Keypair.generate()
  const name = 'je suis un test'
  const post_count = 0

  it('can create blog!', async () => {
    // Add your test here.
    const first_blog = await program.rpc.createBlog( name, post_count, 
    {
      accounts: {
        blogAccount: blog.publicKey,
        authority: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [blog]
    });
    const blogAccount = await program.account.blog.fetch(blog.publicKey)
    assert.equal(name, blogAccount.name)
    assert.equal(post_count, blogAccount.postCount)

  });
  const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum lacinia dapibus. Etiam sit amet aliquet neque. Duis a rhoncus lacus. Aenean dui nunc, pretium dapibus mauris molestie, porttitor rutrum orci. Vivamus quis dui maximus, convallis nisi quis, scelerisque elit. Vivamus nec urna ut massa tempus sodales. Etiam vehicula porta malesuada. Vestibulum ligula ligula, varius nec mollis at, condimentum nec urna. Sed maximus tellus sit amet blandit convallis. Fusce laoreet ipsum in justo convallis sagittis. Suspendisse sagittis tincidunt lorem, faucibus lobortis mi auctor volutpat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut nec nulla nec ante scelerisque molestie. Nullam eleifend mi at risus tincidunt tincidunt vitae et dolor."
  const title = 'lorem ipsum dolor'
  it('can create post!', async () => {
    // Add your test here.
    const first_post = await program.rpc.createPost(title, content, 
    {
      accounts: {
        blogAccount: blog.publicKey,
        postAccount: post.publicKey,
        authority: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [post]
    });
    const postAccount = await program.account.post.fetch(post.publicKey)
    assert.equal(content, postAccount.content)
    assert.equal(title, postAccount.title)
    assert.equal(program.provider.wallet.publicKey.toBase58(), postAccount.authority.toBase58())

  });
});
