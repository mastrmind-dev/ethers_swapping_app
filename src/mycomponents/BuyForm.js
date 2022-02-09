import React, { Component } from "react";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

class BuyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      output: "0",
    };
  }

  render() {
      let web3 = window.web3;
    
    return (
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          let etherAmount;
          etherAmount = this.input.value.toString();
          etherAmount = web3.utils.toWei(etherAmount, "Ether");
          this.props.buyTokens(etherAmount);
        }}
      >
          <div>
              <label htmlFor="">Input:</label>
              <span>
                  Balance : {web3.utils.fromWei(this.props.ethBalance, 'ether')}
              </span>
          </div>

          <div>
              <input type="text" onChange={(e) => {
                  const etherAmount = this.input.value;
                  this.setState({output: etherAmount * 100});
                }}
              ref = {(input) => { this.input = input}} required
              />
              <div><div><img src={ethLogo} alt="" /></div></div>
          </div>
//output
<div>
    <label htmlFor="">
        Output:
    </label>
    <span>
        Balance: {web3.utils.fromWei(this.props.tokenBalance, 'ether')}
    </span>
</div>
<div>
    <input type="text"  value={this.state.output} disabled />
    <div><div><img src={tokenLogo} alt="" /></div></div>
</div>
<button type="submit">submit</button>
      </form>
    );
  }
}

export default BuyForm;