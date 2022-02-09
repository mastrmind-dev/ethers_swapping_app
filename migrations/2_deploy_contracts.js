const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");
const PayItem = artifacts.require("PayItem");

module.exports = async function(deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();

  await token.transfer(ethSwap.address, "1000000000000000000000000000000");

  await deployer.deploy(PayItem, token.address);
};
