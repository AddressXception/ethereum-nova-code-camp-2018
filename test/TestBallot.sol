pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ballot.sol";

contract TestBallot {
    function testBallot_givenDeployed_thenFirstAccountChairperson() public {
        Ballot subject = Ballot(DeployedAddresses.Ballot());

        address actual = subject.chairperson();
        address expected = msg.sender;
        Assert.equal(actual, expected, "contract constructor address is the chairperson");
    }
}