# 🦄 Uniswap Swap Interface

A clean and functional token swap interface powered by Uniswap, built with Next.js and enhanced using thirdweb and ethers.js for blockchain interactions.

---

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: Tailwind CSS
- **Blockchain Interaction**:  
  - **thirdweb** – for wallet connection and React hooks
  - **ethers.js v5** – for transaction signing and Uniswap integration
- **Swapping Logic**: Uniswap SDK
- **State Management**: React Context API
- **Notifications**: react-toastify

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nthitha040100/uniswap-swap-interface.git
   cd uniswap-swap-interface
   ```
2. **Install dependencies:**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env` file with the following:
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

---

## ⚖️ Tradeoff Decisions

### 🔧 thirdweb + ethers.js

- **thirdweb** offers powerful hooks like `useActiveAccount` and a clean `ThirdwebProvider`, which fit naturally in a React/Next.js app.
- **ethers.js v5** provides precise control for transaction creation and signing — especially important when working with the Uniswap SDK.

> **Decision**: Used **thirdweb** for wallet UI/hooks, and **ethers.js** for core transaction handling, combining ease of use with low-level control.

### 🔀 Uniswap SDK vs REST API

- **REST APIs** can be simpler but limit flexibility and may depend on external infra.
- The **Uniswap SDK** allows you to build fully custom trading flows (e.g., quotes, gas estimation, slippage control).

> **Decision**: Went with the **Uniswap SDK** for direct, customizable access to swap logic, ensuring full control and a better user experience.

