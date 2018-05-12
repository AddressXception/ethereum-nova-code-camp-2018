var expectEvent = require('zeppelin-solidity/test/helpers/ExpectEvent');
var Ballot = artifacts.require("Ballot");

contract("Ballot", async (accounts) => {
    let instance;
    let chairperson;

    beforeEach(async () => {
        instance = await Ballot.deployed(3);
        chairperson = await instance.chairperson.call();
    })

    it("should set chairperson to constructor message sender", async () => {

        assert.equal(chairperson, accounts[0], "the sender was not set as the chairperson");
    });

    it("should fire event when valid vote is cast", async () => {
        await instance.giveRightToVote(accounts[1], {from: chairperson});

        let result = await instance.vote(1, {from: accounts[1]}); // special last object can modify the tx
        assert.equal(result.logs[0].event, "VoteCast", "the VoteCast event failed to fire");
    });

    it("should not fire event when voting for invalid proposal", async () => {
        await instance.giveRightToVote(accounts[1], {from: chairperson});

        let result = await instance.vote(4, {from: accounts[1]}); // special last object can modify the tx
        assert.equal(result.logs[0], undefined, "the VoteCast event failed to fire");
    });

    it("should not fire event when invalid voter votes", async () => {

        let result = await instance.vote(1, {from: accounts[1]});
        assert.equal(result.logs[0], undefined, "the VoteCast event failed to fire");
    });

    it("should allow chairperson to destruct contract", async () => {

        let result = await instance.destroy({from: chairperson});
        expectEvent.inLogs(result.logs, "Destroyed")
       // assert.equal(result.logs[0].event, "Destroyed", "the sender was not the chairperson but was able to destroy the contract");
    });

    it("should not allow non-chairpersons to destruct contract", async () => {

        let result = await instance.destroy({from: accounts[1]});
        assert.equal(result.logs[0], undefined, "the sender was not the chairperson but was able to destroy the contract");
    });

    // it("should return all balances to chairperson when destroyed", async () => {
    //     let instance = await Ballot.deployed(3);
    //     let chairperson = await instance.chairperson.call();
    //     await instance.sendTransaction(1, {from: accounts[1]});
    //     let result = await instance.destroy({from: chairperson});
    //     assert.equal(result.logs[0].event, "Destroyed", "the sender was not the chairperson but was able to destroy the contract");
    // });
});