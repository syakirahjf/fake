const VendingMachine = artifacts.require("Fake");

module.exports = function (deployer) {
  deployer.deploy(Fake);
};
