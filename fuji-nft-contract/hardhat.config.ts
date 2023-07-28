import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
        mumbai: {
            chainId: 80001,
            url: MUMBAI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
        localhost: {
            chainId: 31337,
        },
        shibuya: {
            chainId: 81,
            url: "https://evm.shibuya.astar.network",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
        astar: {
            chainId: 592,
            url: "https://evm.astar.network",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-reporter.txt",
        gasPrice: 20,
        token: "ETH",
        noColors: true,
        currency: "JPY",
        coinmarketcap: COINMARKETCAP_API_KEY, // Whenever we run "gasReporter", it makes an API call to coinmarketcap
    },
    solidity: {
        compilers: [
            {
                version: "0.8.20",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY !== undefined ? ETHERSCAN_API_KEY : "",
            polygonMumbai: POLYGONSCAN_API_KEY !== undefined ? POLYGONSCAN_API_KEY : "",
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        admin: {
            default: 1,
        },
    },
    mocha: {
        timeout: 1000000, // 200 seconds max
    },
}

export default config
