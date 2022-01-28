import React from "react";
import Identicon from "identicon.js";

const Navbar = (props) => {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          EthSwap
        </a>
        <p style={{ color: "white" }}>
          {props.account}
          {props.account ? (
            <img
              className="ml-2"
              width="30"
              height="30"
              src={`data:image/png;base64,${new Identicon(
                props.account,
                30
              ).toString()}`}
            />
          ) : (
            <span>No Account</span>
          )}
        </p>
      </nav>
    </div>
  );
};

export default Navbar;
