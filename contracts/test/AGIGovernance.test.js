const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("AGIGovernance", function () {
  let governance;
  let token;
  let timelock;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20Votes");
    token = await Token.deploy("AGI Token", "AGI");
    await token.waitForDeployment();

    const Timelock = await ethers.getContractFactory("TimelockController");
    timelock = await Timelock.deploy(
      86400, // 1 day delay
      [], // proposers (will be set to governance)
      [], // executors (will be set to governance)
      owner.address // admin
    );
    await timelock.waitForDeployment();

    const Governance = await ethers.getContractFactory("AGIGovernance");
    governance = await upgrades.deployProxy(Governance, [
      await token.getAddress(),
      await timelock.getAddress(),
      1, // voting delay
      50400, // voting period (1 week)
      ethers.parseEther("1000"), // proposal threshold
      4 // 4% quorum
    ]);
    await governance.waitForDeployment();

    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    await timelock.grantRole(PROPOSER_ROLE, await governance.getAddress());
    await timelock.grantRole(EXECUTOR_ROLE, await governance.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await governance.name()).to.equal("AGIGovernance");
    });

    it("Should set the right voting parameters", async function () {
      expect(await governance.votingDelay()).to.equal(1);
      expect(await governance.votingPeriod()).to.equal(50400);
      expect(await governance.proposalThreshold()).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Security Features", function () {
    it("Should allow pausing by PAUSER_ROLE", async function () {
      await governance.pause();
      expect(await governance.paused()).to.be.true;
    });

    it("Should not allow non-pauser to pause", async function () {
      await expect(governance.connect(addr1).pause()).to.be.reverted;
    });

    it("Should allow emergency cancel by EMERGENCY_ROLE", async function () {
      const EMERGENCY_ROLE = await governance.EMERGENCY_ROLE();
      expect(await governance.hasRole(EMERGENCY_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Upgradeability", function () {
    it("Should be upgradeable by UPGRADER_ROLE", async function () {
      const UPGRADER_ROLE = await governance.UPGRADER_ROLE();
      expect(await governance.hasRole(UPGRADER_ROLE, owner.address)).to.be.true;
    });
  });
});
