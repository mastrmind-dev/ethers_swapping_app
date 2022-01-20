const { assert } = require("chai");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether"); //we don't have import web3.js if we test using truffle. That's why I haven't imported web3.js at begining of this test file.
}

contract("EthSwap Smart Contract", (accounts) => {
  var ethSwap, token;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens("1000000"));
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has tokens", async () => {
      const balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Sap Token");
    });
  });

  describe("buyTokens()", async () => {
    let result;
    before(async () => {
      result = await ethSwap.buyTokens({
        from: accounts[1],
        value: tokens("1"),
      });
    });

    it("Purchase in ether for sap tokens", async () => {
      let balance = await token.balanceOf(accounts[1]);
      assert.equal(balance.toString(), tokens("100"));
      //to check the token balance of ethSwap after transaction
      balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("999900"));
      //to check the ethereum balance of ethSwap after transaction
      balance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(balance.toString(), tokens("1"));

      const event = result.logs[0].args;
      assert.equal(event.account, accounts[1]);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100"));
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("sell token", async () => {
    let result;
    before(async () => {
      await token.approve(ethSwap.address, tokens("100"), {
        from: accounts[1],
      });
      result = await ethSwap.sellTokens(tokens("100"), { from: accounts[1] });
    });

    it("token balance of investor", async () => {
      let balance = await token.balanceOf(accounts[1]);
      assert.equal(balance.toString(), tokens("0"));

      balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));

      balance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(balance.toString(), tokens("0"));

      const event = result.logs[0].args;
      assert.equal(event.account, accounts[1]);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100"));
      assert.equal(event.rate.toString(), "100");
    });
  });
});
