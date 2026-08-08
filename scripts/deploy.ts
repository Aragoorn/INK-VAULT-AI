import { ethers, upgrades } from "hardhat";

async function main() {
  const InkVaultAI = await ethers.getContractFactory("InkVaultAI");
  console.log("Deploying InkVaultAI Enterprise (UUPS Proxy)...");

  const vault = await upgrades.deployProxy(InkVaultAI, [], {
    initializer: "initialize",
  });

  await vault.waitForDeployment();
  const proxyAddress = await vault.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  console.log("InkVaultAI Proxy deployed to:", proxyAddress);
  console.log("Implementation address deployed to:", implementationAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});