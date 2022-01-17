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
    ethSwap = await EthSwap.new();
    token = await Token.new();
    await token.transfer(ethSwap.address, tokens('1000000'));
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has tokens", async () => {
      const balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(),  tokens('1000000'));
    });
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Sap Token");
    });
  });
});
