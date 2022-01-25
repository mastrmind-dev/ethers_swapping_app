import React, { Component } from "react";
import BuyForm from "./BuyFrom";
import SellForm from "./SellForm";

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
      content = (
        <BuyForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
        />
      );
    } else {
      content = (
        <SellForm
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          sellTokens={this.props.sellTokens}
        />
      );
    }

    return (
      <div id="content" className="">
        <div>
          <button
            onClick={(event) => {
              this.setState({ currentForm: "buy" });
            }}
          >
            Buy
          </button>
          <button onClick={(event) => this.setState({ currentForm: "sell" })}>
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
