import React, { Component } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    //load active account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    //load ethereum balance of the active account
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    //load token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      alert("Token contract is not deployed to detected network");
    }
    //load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      alert("Smar-contract is not deployed to detected network!");
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-ethereum browser is detected. You should consider trying Metamask!"
      );
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens().send({
      value: etherAmount,
      from: this.state.account,
    });
    this.setState({ loading: false });
  };

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.ethSwap.address, tokenAmount)
      .send({
        from: this.state.account,
      })
      .on("confirmation", () => {
        this.state.ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: this.state.account });
      });
    this.setState({ loading: false });
  };

  constructor() {
    super();

    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    };
  }

  render() {
    let content;

    if (this.state.loading) {
      content = <p>Loading...</p>;
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div>
          <div>
            <main>
              <a href=""></a>
              {content}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
