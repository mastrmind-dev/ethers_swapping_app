import React, { Component } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";
import Footer from "./Footer";
import axios from "axios";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.getCryptoData();
  }

  async getCryptoData() {
    // await axios
    //   .get(
    //     "https://api.nomics.com/v1/currencies/ticker?key=b71f7354281cfffaf792da74e28b1a61ae441231&ids=BTC,ETH,XRP&interval=1d,30d&convert=LKR&platform-currency=ETH&per-page=100&page=1"
    //   )
    //   .then((response) => {
    //     this.data = response.data[0];
    //     console.log(
    //       "1 Eth = " +
    //         this.data.price +
    //         " LKR => timestamp = " +
    //         this.data.price_timestamp
    //     );
    //   });
    // this.setState({ rate: Math.round(this.data.price) });
    this.setState({ rate: 400000 });
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
      try {
        const token = new web3.eth.Contract(Token.abi, tokenData.address);
        console.log("token:", token);
        this.setState({ token });
        let tokenBalance = await token.methods
          .balanceOf(this.state.account)
          .call();
        this.setState({ tokenBalance: tokenBalance.toString() });
      } catch (e) {
        console.log("error:", e);
      }
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
    // let intTotalFee = (parseInt(etherAmount) + (parseInt(etherAmount) / 100));
    // console.log('intTotalFee = ' + intTotalFee);
    // let totalFee = await window.web3.utils.toBN(intTotalFee);
    // console.log('totalFee = ', totalFee);
    let sentTime, confirmedTime;
    await this.state.ethSwap.methods
      .buyTokens(this.state.rate)
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", (hash) => {
        const timeInstance = new Date();
        sentTime = timeInstance.getTime();
        console.log("Requested Time:", sentTime);
        // window.location.reload();
      })
      .on("receipt", (receipt) => {
        const timeInstance = new Date();
        confirmedTime = timeInstance.getTime();
        console.log("Receipt Recieved Time:", confirmedTime);
        console.log(
          "Time Gap(Transaction Processing Time):",
          confirmedTime - sentTime
        );
      });
    this.setState({ loading: false });
  };

  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true });
    let totalFee = tokenAmount;
    await this.state.token.methods
      .approve(window.ethSwapData.address, totalFee)
      .send({ from: this.state.account })
      .on("error", (error) => {
        console.log("user rejected giving permission");
        window.alert("You rejected giving permssion to send LKRT.");
        window.location.reload();
      });
    await this.state.ethSwap.methods
      .sellTokens(totalFee, this.state.rate)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("transaction hash = ", hash);
        console.log(hash);
        window.location.reload();
      })
      .on("error", (error) => {
        console.log("user rejected the transaction");
        window.alert("You rejected the transaction.");
        window.location.reload();
      });
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
      rate: 0,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center" style={{ height: "68vh" }}>
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
          rate={this.state.rate}
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
        <Footer />
      </div>
    );
  }
}

export default App;
