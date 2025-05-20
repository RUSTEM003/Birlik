import { ethers } from "ethers";

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.providers.JsonRpcSigner | null = null;

export const initWeb3 = async (): Promise<boolean> => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    return true;
  }
  return false;
};

export const getWalletAddress = async (): Promise<string> => {
  if (!signer) {
    await initWeb3();
  }
  return await signer!.getAddress();
};

export const getBalance = async (): Promise<string> => {
  if (!signer) {
    await initWeb3();
  }
  const address = await signer!.getAddress();
  const balance = await provider!.getBalance(address);
  return ethers.utils.formatEther(balance);
};

export const sendTransaction = async (to: string, amount: number): Promise<{
  success: boolean;
  txHash?: string;
  error?: string;
}> => {
  if (!signer) {
    await initWeb3();
  }
  
  try {
    const tx = await signer!.sendTransaction({
      to: to,
      value: ethers.utils.parseEther(amount.toString())
    });
    
    await tx.wait();
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};
