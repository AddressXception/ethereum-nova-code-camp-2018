var Ballot = artifacts.require("Ballot");
var numProposals = 3;
module.exports = function(deployer) {
    deployer.deploy(Ballot, numProposals);
};