import { ethers } from "ethers"

const version = "1.0.0"

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
]

// TransferWithAuthorizationの型
const TransferWithAuthorization = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "validAfter", type: "uint256" },
  { name: "validBefore", type: "uint256" },
  { name: "nonce", type: "bytes32" },
]

// 署名するデータを作成する関数を用意しておく
export const buildData = (
  name: string,
  chainId: number,
  verifyingContract: string,
  from: string,
  to: string,
  value: string,
  nonce: string,
  validAfter = 0,
  validBefore = Math.floor(Date.now() / 1000) + 3600
) => ({
  primaryType: "TransferWithAuthorization",
  types: { EIP712Domain, TransferWithAuthorization },
  domain: { name, version, chainId, verifyingContract },
  message: { from, to, value, validAfter, validBefore, nonce },
})
