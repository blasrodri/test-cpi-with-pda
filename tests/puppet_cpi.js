const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const PublicKey = require("@solana/web3.js").PublicKey;

const assert = require("assert");

const account = anchor.web3.Keypair.generate(); // initialization

describe("puppet_cpi", () => {
  // Configure the client to use the local cluster

  const provider = anchor.Provider.env();

  anchor.setProvider(provider);

  const puppet = anchor.workspace.PuppetCpi;
  const master = anchor.workspace.PupperMaster;

  it("Is initialized!", async () => {
    // Add your test here.

    // const [puppetMasterPDA, puppetMasterBump] =
    //   await PublicKey.findProgramAddress(
    //     [Buffer.from("cpi-pda")],
    //     puppet.programId
    //   );

      const [firstPDA, _] = await PublicKey
      .findProgramAddress(
        [],
        master.programId
      );

      const [testPDA, __] = await PublicKey.findProgramAddress([], puppet.programId)

    let tx = await puppet.methods
      .initialize(firstPDA)
      .accounts({
        puppet: account.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([account])
      .rpc();

    console.log("Initialization tx: ", tx);


    // await puppet.methods.setData(5).accounts({
    //   puppet: account.publicKey
    // }).rpc();

    tx = await master.methods.pullStrings(_,new anchor.BN(5)).accounts({
      puppetProgram: puppet.programId,
      puppet: account.publicKey,
      authority: firstPDA
    }).rpc();

    console.log(tx);

    const val = await puppet.account.data.fetch(account.publicKey);

    console.log(val.data);

    assert.ok(val.data == 5);
  });
});
