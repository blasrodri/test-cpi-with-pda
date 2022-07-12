import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PuppetCpi } from "../target/types/puppet_cpi";
import { PupperMaster } from "../target/types/pupper_master";
import { v4 as uuidv4 } from "uuid";
const assert = require("assert");

describe("puppet_cpi", () => {
  // Configure the client to use the local cluster

  const provider = anchor.Provider.env();

  anchor.setProvider(provider);

  const puppet = anchor.workspace.PuppetCpi as Program<PuppetCpi>;
  const master = anchor.workspace.PupperMaster as Program<PupperMaster>;

  const admin = anchor.web3.Keypair.generate();

  // const pdaId = uuidv4();

  // successful uid
  // const pdaId = "37f9b205-998c-4583-8d58-ebb7db846755";

  // unsuccessful uid
  const pdaId = "25df58b2-e5a7-46c7-9803-fdfd2a3895d4";
  

  it("funds the user", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 10000000000),
      "confirmed"
    );

    const adminUserBalance = await provider.connection.getBalance(
      admin.publicKey
    );

    assert.strictEqual(10000000000, adminUserBalance);
  });

  it("Initialize the pupper", async () => {
    const [puppetPDA, puppetBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(pdaId.substring(0, 18)),
          Buffer.from(pdaId.substring(18, 36)),
        ],
        puppet.programId
      );

      const tx = await puppet.methods.initialize(pdaId, admin.publicKey).accounts({
        puppet: puppetPDA,
        user: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }).signers([admin]).rpc();
    
  });

  it("make a cpi call", async() => {

    const [puppetPDA, puppetBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(pdaId.substring(0, 18)),
          Buffer.from(pdaId.substring(18, 36)),
        ],
        puppet.programId
      );

    const tx = await master.methods.pullStrings(pdaId, puppetBump, new anchor.BN(10)).accounts({
      puppetAccount: puppetPDA,
      puppetProgram: puppet.programId
    }).rpc();

    console.log(tx)


  })

});
