const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();
const NFTMarketplace_abi = require("./NFTMarketplace.sol/NFTMarketplace.json");
const { ethers } = require("ethers");
// import Auction_abi from "./Auction.sol/Auction"

async function main() {
  var web3 = await new Web3(process.env.REACT_APP_ethereum_provider);
  // var w3 = await new Web3("HTTP://127.0.0.1:7545");
  // console.log("Ganache", web3);
  let tokenURI =
    "https://ipfs.io/ipfs/QmRjU4FgEXMN4xTWPbQgWBKzB1BZsQEWKHPj4iQmo9APBo";
  var account = web3.eth.accounts.privateKeyToAccount(
    process.env.REACT_APP_Private_key
  );

  web3.eth.defaultAccount = process.env.REACT_APP_SIGNER;
  var NFTMarketplace = new web3.eth.Contract(
    NFTMarketplace_abi.abi,
    process.env.REACT_APP_NFTMarketplace_Address
  );
  var tx = await NFTMarketplace.methods.createToken(tokenURI, 2000000);
  /** Encoding and function signature the Function ABI for using as data field in web3.eth.sendTransaction */
  var encode_tx = await tx.encodeABI();
  /** Retrieving the Gas price and Gas value */
  const [gasPrice, gasCost] = await Promise.all([
    web3.eth.getGasPrice(),
    tx.estimateGas({ from: account.address }),
  ]);
  /** Making the transaction blob */
  const txData = {
    from: account.address,
    to: NFTMarketplace._address,
    data: encode_tx,
    gas: gasCost,
    gasPrice,
  };
  /** signTransaction */
  var signed_tx = await web3.eth.accounts.signTransaction(
    txData,
    process.env.REACT_APP_Private_key
  );
  const receipt = await web3.eth.sendSignedTransaction(
    signed_tx.rawTransaction
  );
  console.log("Receipt", receipt);

  tx = await NFTMarketplace.methods
    .fetchMyNFTs()
    .call({ from: account.address });
  console.log("NFTS", tx);

  //
  var txn = await NFTMarketplace.methods.tokenURI(14).call();
  console.log("TokenURI", txn);
  // .call({ from: process.env.REACT_APP_SIGNER });
  /*********** Implementation on Ganache */
  // var NFTMarketplace_Provider = new w3.eth.Contract(
  //   NFTMarketplace_abi.abi,
  //   "0x6A340c868A335baa5C9D46D5C405aC9c8829CBf2"
  // );

  // var tokenURI =
  //   "https://gateway.pinata.cloud/ipfs/QmPBDW3ryhPrvcX1WNELoxUPHpmQ42gMHJvGz6bmzHrCky";
  // var account = web3.eth.accounts.privateKeyToAccount(
  //   process.env.REACT_APP_Private_key
  // );
  // // const address = web3.utils.toChecksumAddress(process.env.REACT_APP_SIGNER);
  // var tx = await NFTMarketplace_Provider.methods.createToken(tokenURI, 1).send({
  //   from: "0x197e7f79db5c2b98a6f7b4d4d1a774aa9966dfdd",
  //   gas: 6721975,
  // });
  // console.log("Minted", tx);
  // try {
  //   var txn = await NFTMarketplace_Provider.methods.fetchMyNFTs().call();
  //   console.log("txn", txn);
  // } catch (error) {
  //   console.log("Error", error);
  // }

  /********************************* Transaction on Ganache */
  // var tx_blob = {
  //   from: "0x197E7F79DB5C2b98A6F7B4d4d1A774Aa9966DFDd",
  //   to: "0x12a8e78d73C84B48675e2172c83e95b403a55baF",
  //   value: web3.utils.toWei("5", "ether"),
  // };
  // var txn = await w3.eth.sendTransaction(tx_blob);
}
const splitSign = (sign) => {
  let sig = ethers.utils.splitSignature(sign);
  // console.log(sig);
  return [sig.v, sig.r, sig.s];
};

const signMeta = async () => {
  let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

  /** Owner Signature for minting */
    let hash = web3.utils.soliditySha3({
      type:'address', value:'0x1d1C63d8e0cE68Ef2B95da039B031a496AaA2036', // Contract Address
      type:'address',value:'0xCaa32b305B44F7Fbf1782c20270B69E8DD3c591b', // Seller
      type:'string', value:'xyz', // URI
      type:'uint96', value:'11', //Royality
      type:'uint256', value:'25' // Nonce
  });
  // let hash = web3.utils.soliditySha3(
  //   "0x1d1C63d8e0cE68Ef2B95da039B031a496AaA2036", // Contract Address
  //   "0xCaa32b305B44F7Fbf1782c20270B69E8DD3c591b", // Seller
  //   "abc", // URI
  //   2, //Royality
  //   22 // Nonce
  // );

  /** Seller Signature for Selling */
  // let hash = web3.utils.soliditySha3(
  //   "0xb33E5991DC689c7fFFF41594b72Cb9FBA381987a", // Contract Address
  //   1, // TokenID
  //   "0x0000000000000000000000000000000000000000", // Payment address (ETH)
  //   100000000000000, // price
  //   25
  // );
  console.log("hash", hash);
  // let sign = await web3.eth.accounts.sign(
  //   hash,
  //   "c829270f5d887794bb7c1d66d78a65baf0d0b9048516f20cb9172a0f071e4232"
  // );
  // console.log("raw Sign", sign);
  // let signature = splitSign(sign);
  // console.log("Splitted Sign", JSON.stringify(signature));
};

signMeta();

let sign = splitSign(
  "0x89b027f271fd5b574a6c08215e6b2c8adc7b31fd547e73b48901885c879fdd27463ac2fe15d09ca334f018d81ebc9d837a439e18b530ba61a459f00989a770f21c"
);
console.log("Sign 2 ", sign);

//  function verifySign(string memory _tokenURI, uint96 _royaltyFee, address _caller, Sign memory _sign) internal view {
//         bytes32 hash = keccak256(abi.encodePacked(this, _caller, _tokenURI, _royaltyFee, _sign.nonce));
//         require(owner() == ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)), _sign.v, _sign.r, _sign.s), "Owner sign verification failed");
//     }

//    function verifySign(string memory tokenURI, address caller, Sign memory sign) internal view {
//         bytes32 hash = keccak256(abi.encodePacked(this, caller, tokenURI, sign.nonce));
//         require(owner == ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)), sign.v, sign.r, sign.s), "Owner sign verification failed");
//     }
