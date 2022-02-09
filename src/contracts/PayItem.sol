pragma solidity ^0.5.0;

import "./Token.sol";

contract PayItem {
    string public name = "Payment Gateway";
    Token public token;
    address public owner;

    event TokenPurchased(
        address customer,
        address merchant,
        address token,
        uint256 amount
    );

    constructor(Token _token) public {
        token = _token;
        owner = msg.sender;
    }

    function payItem(uint256 _amount) public {
        require(
            token.balanceOf(msg.sender) >= _amount,
            "You don't have enough tokens!"
        );

        token.transferFrom(msg.sender, owner, _amount);

        emit TokenPurchased(msg.sender, owner, address(token), _amount);
    }
}
