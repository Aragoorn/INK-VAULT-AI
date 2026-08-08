import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { InkVaultAI } from "../typechain-types";

describe("InkVaultAI Enterprise Core", function () {
  let inkVault: InkVaultAI;
  let owner: SignerWithAddress;
  let tradingBot: SignerWithAddress;
  let user: SignerWithAddress;
  let target: SignerWithAddress;

  beforeEach(async function () {
    [owner, tradingBot, user, target] = await ethers.getSigners();

    const InkVaultAIFactory = await ethers.getContractFactory("InkVaultAI");
    
    inkVault = (await upgrades.deployProxy(InkVaultAIFactory, [], {
      initializer: "initialize",
      kind: "uups",
    })) as unknown as InkVaultAI;

    await inkVault.waitForDeployment();
  });

  describe("Initialization & Access Control", function () {
    it("Should initialize with correct owner and defaults", async function () {
      expect(await inkVault.owner()).to.equal(owner.address);
      expect(await inkVault.maxTradeLimit()).to.equal(ethers.parseEther("10"));
    });

    it("Should allow owner to set trading bot and whitelisted target", async function () {
      await inkVault.setTradingBot(tradingBot.address);
      expect(await inkVault.tradingBot()).to.equal(tradingBot.address);

      await inkVault.setWhitelistedTarget(target.address, true);
      expect(await inkVault.whitelistedTargets(target.address)).to.be.true;
    });
  });

  describe("Trade Execution Layer", function () {
    beforeEach(async function () {
      await inkVault.setTradingBot(tradingBot.address);
      await inkVault.setWhitelistedTarget(target.address, true);
    });

    it("Should restrict trade execution to whitelisted targets only", async function () {
      const nonWhitelistedTarget = user.address;
      
      await expect(
        inkVault.connect(tradingBot).executeTrade(nonWhitelistedTarget, "0x", 0)
      ).to.be.revertedWith("Target not whitelisted");
    });

    it("Should execute trade successfully from authorized bot", async function () {
      await expect(
        inkVault.connect(tradingBot).executeTrade(target.address, "0x", 0)
      ).to.emit(inkVault, "TradeExecuted").withArgs(target.address, 0);
    });
  });

  describe("Linear Vesting System", function () {
    it("Should support Linear Vesting claim over time", async function () {
      const vestingAmount = ethers.parseEther("1.0");
      const duration = 1000;
      const latestTime = await time.latest();

      await owner.sendTransaction({
        to: await inkVault.getAddress(),
        value: vestingAmount,
      });

      await inkVault.setLinearVesting(user.address, vestingAmount, latestTime, duration);

      await time.increase(500);

      const balanceBefore = await ethers.provider.getBalance(user.address);

      const tx = await inkVault.connect(user).claimVesting();
      const receipt = await tx.wait();
      const gasUsed = receipt!.fee;

      const balanceAfter = await ethers.provider.getBalance(user.address);

      const actualReceived = balanceAfter + gasUsed - balanceBefore;
      
      expect(actualReceived).to.be.closeTo(
        ethers.parseEther("0.5"),
        ethers.parseEther("0.01")
      );
    });
  });

  describe("Emergency & Administrative Controls", function () {
    it("Should allow emergency ETH withdrawal by owner", async function () {
      const ethAmount = ethers.parseEther("1.0");
      await owner.sendTransaction({
        to: await inkVault.getAddress(),
        value: ethAmount,
      });

      await expect(inkVault.emergencyWithdraw(ethers.ZeroAddress, ethAmount))
        .to.emit(inkVault, "EmergencyWithdrawn")
        .withArgs(owner.address, ethAmount, ethers.ZeroAddress);
    });

    it("Should pause and unpause operations", async function () {
      await inkVault.pause();
      expect(await inkVault.paused()).to.be.true;

      await inkVault.unpause();
      expect(await inkVault.paused()).to.be.false;
    });
  });
});