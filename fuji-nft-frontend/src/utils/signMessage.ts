import { Wallet } from "@rize-labs/banana-wallet-sdk"

export const signMessage = async (walletInstance: Wallet, signMessage: any) => {
  const signer = walletInstance.getSigner()
  return await signer.signBananaMessage(signMessage)
}
