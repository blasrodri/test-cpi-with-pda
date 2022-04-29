const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const PublicKey = require("@solana/web3.js").PublicKey;

const assert = require("assert");

const account = anchor.web3.Keypair.generate(); // initialization
const account2 = anchor.web3.Keypair.generate();

describe("puppet_cpi", () => {
  // Configure the client to use the local cluster

  const provider = anchor.Provider.env();

  anchor.setProvider(provider);

  const puppet = anchor.workspace.PuppetCpi;
  const master = anchor.workspace.PupperMaster;

  it("Is initialized!", async () => {
    // Add your test here.

      const [firstPDA, firstBump] = await PublicKey
      .findProgramAddress(
        [Buffer.from("first"), account.publicKey.toBuffer()],
        master.programId
      );

      const [secondPDA, secondBump] = await PublicKey.findProgramAddress([Buffer.from("first"), account2.publicKey.toBuffer()], master.programId)

      // const [testPDA, secondBump] = await PublicKey.findProgramAddress([], puppet.programId)

    let tx = await puppet.methods
      .initialize(firstPDA)
      .accounts({
        puppet: account.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([account])
      .rpc();

    tx = await puppet.methods
      .initialize(secondPDA)
      .accounts({
        puppet: account2.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([account2])
      .rpc();

    tx = await master.methods.pullStrings(firstBump,new anchor.BN(5)).accounts({
      puppetProgram: puppet.programId,
      puppet: account.publicKey,
      authority: firstPDA
    }).rpc();

    tx = await master.methods.pullStrings(secondBump,new anchor.BN(10)).accounts({
      puppetProgram: puppet.programId,
      puppet: account2.publicKey,
      authority: secondPDA
    }).rpc();


    const val = await puppet.account.data.fetch(account.publicKey);


    const vals = await puppet.account.data.fetch(account2.publicKey);


    tx = await master.methods.pullStrings(secondBump,new anchor.BN(15)).accounts({
      puppetProgram: puppet.programId,
      puppet: account2.publicKey,
      authority: secondPDA
    }).rpc();

    const x = await puppet.account.data.fetch(account2.publicKey);

    const y = await puppet.account.data.fetch(account.publicKey);

    assert.ok(val.data == 5);
    assert.ok(vals.data == 10);
    assert.ok(val.data == y.data);
    assert.ok(x.data == 15);
  });
});
