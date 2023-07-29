import { ethers } from "hardhat"
import { BasicNft } from "../typechain-types"

async function mint() {
    // await deployments.fixture(["basicnft"])
    // const BasicNft = await deployments.get("BasicNft")
    const basicNftAddr = "0x0eA651Aa5f9f0bA9ed1cC5ab422034D0861db806"
    const basicNft: BasicNft = (await ethers.getContractAt("BasicNft", basicNftAddr)) as BasicNft
    console.log("Minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(`GOT TOKENID: ${tokenId}`)
    console.log(`NFT Address: ${basicNft.address}`)
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
