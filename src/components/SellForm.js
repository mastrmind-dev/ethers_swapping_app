import React, { Component } from "react";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

class SellForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      output: "0",
    };
  }

  render() {
    return (
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          let tokenAmount;
          tokenAmount = this.input.value.toString();
          tokenAmount = window.web3.utils.toWei(tokenAmount, "ether");
          this.props.sellTokens(tokenAmount);
        }}
      >
        <div>
          <label htmlFor="">Input</label>
          <br />
          <span>
            Balance:
            {window.web3.utils.fromWei(this.props.tokenBalance, "ether")}
          </span>
        </div>

        <div>
          <input
            type="text"
            ref={(input) => (this.input = input)}
            onChange={(e) => {
              const tokenAmount = this.input.value;
              this.setState({ output: (tokenAmount / 100).toString() });
            }}
            required
          />
        </div>

        <div>
          <div>
            <img src={tokenLogo} alt="" />
          </div>
        </div>

        <div>
          <label htmlFor="">Output</label>
          <br />
          <span>
            Balance: {window.web3.utils.fromWei(this.props.ethBalance, "ether")}
          </span>
        </div>
        <div>
          <input type="text" value={this.state.output} disabled />
        </div>
        <img src={ethLogo} alt="" />

        <button type='submit'>Exchange</button>
      </form>
    );
  }
}

export default SellForm;
