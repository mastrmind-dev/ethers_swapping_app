import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: '0'
    }
  }

  render() {
    return (
      <div>
        <form
          className="mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            let etherAmount;
            etherAmount = this.input.value.toString();
            etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
            this.props.buyTokens(etherAmount);
          }}
        >
          {/* ==============================>first input bar<=============================== */}
          <div>
            <label className="float-left">
              <b>Input</b>
            </label>
            <span className="float-right text-muted">
              Balance:{" "}
              {window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
            </span>
          </div>
          <div className="input-group mb-4">
            <input
              type="text"
              onChange={(event) => {
                const etherAmount = this.input.value.toString();
                this.setState({
                  output: etherAmount * this.props.rate,
                });
              }}
              ref={(input) => {
                this.input = input;
              }}
              className="form-control form-control-lg"
              placeholder="0"
              required
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img
                  src={ethLogo}
                  height="32"
                  alt=""
                  style={{ borderRadius: "50" }}
                />
                &nbsp;&nbsp;&nbsp; ETH
              </div>
            </div>
          </div>

          {/* ============================>second input bar<==================================== */}
          <div>
            <label className="float-left">
              <b>Output</b>
            </label>
            <span className="float-right text-muted">
              Balance:{" "}
              {window.web3.utils.fromWei(this.props.tokenBalance, "Ether")}
            </span>
          </div>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="0"
              value={this.state.output}
              disabled
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={tokenLogo} height="32" alt="" />
                &nbsp;&nbsp;&nbsp; LKRT
              </div>
            </div>
          </div>

          {/* ====================================>exchange rate<=================================== */}
          <div className="mb-5">
            <span className="float-left text-muted">Currnet Exchange Rate</span>
            <span className="float-right text-muted">
              1 ETH = {this.props.rate} LKRT
            </span>
          </div>
          {/* ========================>submit button<=============================== */}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            EXCHANGE
          </button>
        </form>
      </div>
    );
  }
}

export default BuyForm;
