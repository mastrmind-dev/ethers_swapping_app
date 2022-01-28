import React, { Component } from "react";
import BuyForm from "./BuyForm";
//import SellForm from "./SellForm";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentForm: "buy",
    };
  }

  render() {
    let content;
    if (this.state.currentForm === "buy") {
      content = <BuyForm
      ethBalance = {this.props.ethBalance}
      tokenBalance = {this.props.tokenBalance}
      buyTokens = {this.props.buyTokens}
      />
    } else {
      content = "sell form";
    }

    return (
      <div className="mt-5">
        <div>
          <button
            onClick={(e) => {
              return this.setState({ currentForm: "buy" });
            }}
          >
            Buy
          </button>

          <button
            onClick={(e) => {
              return this.setState({ currentForm: "sell" });
            }}
          >
            Sell
          </button>
        </div>

        <div>
          <div>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
