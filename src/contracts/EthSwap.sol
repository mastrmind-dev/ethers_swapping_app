pragma solidity ^0.5.0;
    
import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokenSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens(uint _rate) public payable {
        uint256 tokenAmount = msg.value * _rate;

        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "No enough tokens"
        );

        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, _rate);
    }

    function sellTokens(uint256 _amount, uint _rate) public {
        require(token.balanceOf(msg.sender) >= _amount);
        uint256 etherAmount = _amount / _rate;

        require(address(this).balance >= etherAmount, 'no enough ethers');

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokenSold(msg.sender, address(token), _amount, _rate);
    }
}
