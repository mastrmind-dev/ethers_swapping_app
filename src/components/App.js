import React, { Component } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";
import axios from "axios";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  componentDidMount() {
    this.getCryptoData();
  }

  async getCryptoData() {
    await axios
      .get(
        "https://api.nomics.com/v1/currencies/ticker?key=b71f7354281cfffaf792da74e28b1a61ae441231&ids=BTC,ETH,XRP&interval=1d,30d&convert=LKR&platform-currency=ETH&per-page=100&page=1"
      )
      .then((response) => {
        console.log(
          "1 Eth = " +
            response.data[0].price +
            " LKR => timestamp = " +
            response.data[0].price_timestamp
        );
        this.setState({ ethToLkr: response.data[0].price });
      });
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    // Load Token
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
      window.alert("Token contract not deployed to detected network.");
    }

    // Load EthSwap
    window.ethSwapData = EthSwap.networks[networkId];
    if (window.ethSwapData) {
      const ethSwap = new web3.eth.Contract(
        EthSwap.abi,
        window.ethSwapData.address
      );
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network.");
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
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  buyTokens = async (etherAmount) => {
    this.setState({ loading: true });
    await this.state.ethSwap.methods
      .buyTokens(this.state.ethToLkr)
      .send({ value: etherAmount, from: this.state.account });
    this.setState({ loading: false });
  };

  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true });
    await this.state.token.methods
      .approve(window.ethSwapData.address, tokenAmount)
      .send({ from: this.state.account });
    await this.state.ethSwap.methods
      .sellTokens(tokenAmount, this.state.ethToLkr)
      .send({ from: this.state.account });
    this.setState({ loading: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      ethBalance: "0",
      tokenBalance: "0",
      loading: true,
      ethToLkr: "0.00",
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
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
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a target="_blank" rel="noopener noreferrer"></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
