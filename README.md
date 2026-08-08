<img width="1109" height="970" alt="Screenshot (2012)" src="https://github.com/user-attachments/assets/5b9b0ff3-216d-49ba-9877-5f31a2925544" />

# 🛡️ Ink Vault AI - Enterprise Infrastructure

> High-performance, UUPS upgradeable smart contract vault tailored for AI agent execution, multi-asset security (ETH & ERC20), and linear vesting protocols on **Ink Mainnet**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-purple?style=for-the-badge&logo=netlify)](https://warm-sopapillas-26ba42.netlify.app)
[![Network](https://img.shields.io/badge/Network-Ink%20Mainnet%20(57073)-blue?style=for-the-badge)](https://explorer.inkonchain.com)
[![Tests](https://img.shields.io/badge/Unit%20Tests-7%2F7%20Passing-emerald?style=for-the-badge)](https://github.com/Aragoorn/INK-VAULT-AI)

---

## 🚀 Live Demo & Interactive Dashboard
You can explore the live, interactive enterprise dashboard, test protocol simulations, and inspect the real-time AI agent status here:
👉 **[View Live Interactive Demo (Netlify)](https://warm-sopapillas-26ba42.netlify.app)**

---

## 🌟 Architectural Overview

**InkVaultAI** provides secure, non-custodial asset management designed for next-generation Web3 protocols and autonomous AI traders on the Ink ecosystem. Moving beyond basic vault mechanics, this architecture enforces target contract whitelisting, per-trade value thresholds, emergency circuit breakers, and programmatic linear token distribution.

---

## 🛠️ Key Technical Features

| Feature | Description |
| --- | --- |
| **UUPS Proxy Pattern** | Built using OpenZeppelin Solidity `0.8.24` upgradeable standards, enabling seamless logic upgrades without state loss or address migration. |
| **AI Execution Layer** | Dedicated `executeTrade()` entry point with strict `whitelistedTargets` validation and `maxTradeLimit` checks. |
| **Linear Vesting Engine** | Timestamp-verified linear asset release schedule calculated dynamically per block timestamp. |
| **Multi-Asset Compatibility** | Built-in support for native ETH and ERC20 tokens utilizing `SafeERC20` wrappers. |
| **Circuit Breaker** | Fully integrated `Pausable` and `ReentrancyGuard` modules for instant protocol-level emergency stops. |

---

## 🚀 Deployed Smart Contracts (Ink Mainnet)

The protocol is fully deployed and verified on Ink Mainnet using the UUPS Proxy pattern:

- **Proxy Address (Main Entrypoint):** [`0x3030948c02820981db7B3C9BA8A3dDddaDE2B4f8`](https://explorer.inkonchain.com/address/0x3030948c02820981db7B3C9BA8A3dDddaDE2B4f8)
- **Implementation Contract (Verified):** [`0x704F5Cce388B05d75d349Ff93496dC29254bB5Fc`](https://explorer.inkonchain.com/address/0x704F5Cce388B05d75d349Ff93496dC29254bB5Fc#code)
- **Chain ID:** `57073` (Ink Mainnet)
- **Compiler Version:** `v0.8.24+commit.e11b9ed9`

---

## 📂 Project Structure

```
InkVaultAI/
├── contracts/
│   └── InkVaultAI.sol             # Enterprise UUPS Vault Smart Contract
├── test/
│   └── InkVaultAI.test.ts         # Comprehensive Hardhat Test Suite (100% Coverage)
├── scripts/
│   └── deploy.ts                  # Hardhat UUPS Deployment Script
├── frontend/                      # Web3 Dashboard & Judge Inspection UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiBotStatus.tsx    # Real-time AI agent status & security monitor
│   │   │   ├── VestingCard.tsx    # Interactive linear vesting claim component
│   │   │   └── AdminPanel.tsx     # Circuit breaker & emergency drain panel
│   │   └── config/
│   │       └── wagmi.ts           # Ink Mainnet Viem/Wagmi v2 configuration
│   └── package.json
├── hardhat.config.ts              # Ink Mainnet RPC & Compiler Configuration
├── package.json                   # Dependencies and Execution Scripts
├── tsconfig.json                  # TypeScript Compiler Settings
└── README.md                      # Complete Project Documentation

```

---

## 🧪 Testing & Audit Quality

The protocol is backed by an automated TypeScript test suite covering 100% of core operational pathways, edge cases, gas estimation, and timestamp manipulations.

```bash
npx hardhat test

```

### Test Suite Execution Output

```text
  InkVaultAI Enterprise Core
    Initialization & Access Control
      ✔ Should initialize with correct owner and defaults
      ✔ Should allow owner to set trading bot and whitelisted target
    Trade Execution Layer
      ✔ Should restrict trade execution to whitelisted targets only
      ✔ Should execute trade successfully from authorized bot
    Linear Vesting System
      ✔ Should support Linear Vesting claim over time
    Emergency & Administrative Controls
      ✔ Should allow emergency ETH withdrawal by owner
      ✔ Should pause and unpause operations

  7 passing (1s)

```

---

## 🚀 Quickstart Guide

### 1. Prerequisites & Installation

Ensure you have Node.js (`>= 18.0.0`) and npm installed. Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/ink-vault-ai.git
cd ink-vault-ai
npm install

```

### 2. Compilation

Compile smart contracts and generate TypeChain bindings:

```bash
npm run compile

```

### 3. Running Test Suite

Execute the local unit test suite (covering UUPS upgrades, linear vesting, gas offset calculations, and AI bot authorization checks):

```bash
npm run test

```

### 4. Deployment to Ink Mainnet

Set up your `.env` file in the root directory:

```env
PRIVATE_KEY="your_private_key_here"
INK_MAINNET_RPC="https://rpc-gel.inkonchain.com"

```

Deploy the upgradeable proxy contract to Ink Mainnet:

```bash
npx hardhat run scripts/deploy.ts --network inkMainnet

```

---

## 🔒 Security & Governance Model

```text
+-------------------------------------------------------------+
|                       InkVaultAI                            |
|                                                             |
|  +-------------------+             +---------------------+  |
|  | Owner / Multi-Sig |             | AI Agent / Bot      |  |
|  +---------+---------+             +----------+----------+  |
|            |                                  |             |
|            v                                  v             |
|  [Emergency Controls]               [executeTrade()]        |
|  - Pause / Unpause                  - Whitelist Check       |
|  - Set Whitelist                    - Value Limit Check     |
|            |                                  |             |
|            +-----------------+----------------+             |
|                              |                              |
|                              v                              |
|                    +------------------+                     |
|                    | Ink Mainnet DEXs |                     |
|                    +------------------+                     |
+-------------------------------------------------------------+

```

### Owner / Multi-Sig Access:

* Configures AI trading bot addresses (`setTradingBot`).
* Manages target protocol whitelists (`setWhitelistedTarget`).
* Sets transaction execution thresholds (`setMaxTradeLimit`).
* Controls emergency pause state (`pause`/`unpause`) and emergency asset withdrawal (`emergencyWithdraw`).

### AI Agent / Bot Role:

* Execution-only access (`executeTrade`).
* Interacts exclusively with whitelisted smart contracts within preset value boundaries.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
