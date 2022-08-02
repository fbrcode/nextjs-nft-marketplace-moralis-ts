import { useEffect, useState } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import Image from 'next/image';
import { Card } from 'web3uikit';
import { ethers } from 'ethers';
import {
  // loadDeployedNftMarketplaceContract,
  loadDeployedBasicNftContract,
  networkMapping,
} from '../constants';

export default function NFTBox({ marketplaceAddress, nftAddress, tokenId, price, seller }) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');

  const chainId = parseInt(chainIdHex);
  const networkName = networkMapping[chainId];
  // console.log(`NFTBox: chainId: ${chainId}`);
  // console.log(`NFTBox: networkName: ${networkName}`);
  // const nftMarketplaceContract = loadDeployedNftMarketplaceContract(networkName);
  const basicNftContract = loadDeployedBasicNftContract(networkName);
  // console.log(`NFTBox: basicNftContract: ${basicNftContract}`);
  // const basicNftAddress = basicNftContract.address;
  const basicNftAbi = basicNftContract.abi;
  // console.log(`basicNftAbi: ${JSON.stringify(basicNftAbi, null, 2)}`);
  // console.log(`basicNftAbi (length): ${basicNftAbi.length}`);
  // console.log(`basicNftAddress: ${nftAddress}`);
  // console.log(`basicNftContract Address: ${basicNftAddress}`);
  // console.log(`tokenId: ${tokenId}`);

  const options = {
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: 'TOKEN_URI',
    params: {
      tokenId,
    },
  };

  const { runContractFunction: getTokenURI } = useWeb3Contract(options);

  async function updateUI() {
    console.log('options:');
    console.log(options);
    // get the token URI
    // using the image tag from the token URI, get the image
    const tokenURI = await getTokenURI();
    console.log(`Token URI ==> ${tokenURI}`);
    if (tokenURI) {
      // cheating to have more browser support :: use IPFS gateway instead,
      // which is a server the returns IPFS files from "normal" URL
      const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await fetch(requestURL);
      const tokenUriResponse = await response.json();
      const imageURI = tokenUriResponse.image;
      const imageUriUrl = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setImageURI(imageUriUrl);
      setTokenName(tokenUriResponse.name);
      setTokenDescription(tokenUriResponse.description);
      // other options could be:
      // - we could render the image on out server, and just call the server
      // - for testnets & mainnet we could use moralis server hooks
      // - have the world adopt IPFS :)
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <div>
        {imageURI ? (
          <Card title={tokenName} description={tokenDescription}>
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">Owned by {seller}</div>
                <Image loader={() => imageURI} src={imageURI} height="200" width="200" />
                <div className="font-bold">{ethers.utils.formatUnits(price, 'ether')} ETH</div>
              </div>
            </div>
          </Card>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
