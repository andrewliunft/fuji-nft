import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployNftMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const jpycAddr = "0x772506B2e4105ABE0489895E807e45bA09c83db8"
    const waitBlockConfirmations = 1

    log("----------------------------------------------------")
    const args: any[] = [jpycAddr]
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying...")
    //     await verify(nftMarketplace.address, args)
    // }
    log("----------------------------------------------------")
}

export default deployNftMarketplace
deployNftMarketplace.tags = ["all", "nftmarketplace"]
