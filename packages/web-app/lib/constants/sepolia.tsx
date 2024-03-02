import { BigNumber } from "ethers";

export const permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
export const NATION = "0x23Ca3002706b71a440860E3cf8ff64679A00C9d7";
export const frameworkAddress = "0xD96aA6e2568f4e9632D2A5234Bb8410ca7609a27";
export const arbitratorAddress = "0xBe67cEdCD1FE38aac8a5781A51250FDeFB344E6C";
export const cohortAddress = "0x2F957C3D949b4e3967E1ddF646614b77BF46057e"; //GnosisSafeProxy
export const safeTxServiceUrl = "https://safe-transaction-sepolia.safe.global";
export const subgraphURI = process.env.NEXT_PUBLIC_GRAPH_API_URL_SEPOLIA;
export const appealCost = BigNumber.from("1000000000000000000");
