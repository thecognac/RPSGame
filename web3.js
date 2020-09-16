const Web3 = require('web3');
const TX = require("ethereumjs-tx");
//const { interface, bytecode} = require('./compile');

//var trx;
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5ba1700b96a4442a91fcdfbeb868bd5f"));

const interface = [{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],
"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,
"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"player","outputs":[{"name":"cardtype","type":"uint256"},
{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenId",
"outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,
"inputs":[{"name":"","type":"uint256"}],"name":"approval","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"playersTokenCount","outputs":[{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},
{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],
"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},
{"name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"typ","type":"uint256"},{"name":"_totalcount","type":"bool"}],
"name":"returnTokenCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":false,"inputs":[{"name":"playeraddress","type":"address"},{"name":"cardtype","type":"uint256"},{"name":"_value","type":"uint256"}],
"name":"createToken","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],
"name":"tokenOwners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"tokenDetails","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],
"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"contractAddress","type":"address"}],"payable":false,
"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},
{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},
{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"}];

var deployeContractdAddress = '0xc1A8f5738AFB7dA4fbeff31C97862e28bA7DA395';

var ownerAddress = '0x63580a35A6B6Da5c13c1Bf9c62C51FbCe64c806F';

var _interact = new web3.eth.Contract(interface, deployeContractdAddress);


const runCode = async(trx) =>{
    const accounts = await web3.eth.getAccounts();
    var count = await web3.eth.getTransactionCount(ownerAddress);

    
    const gasprice = await web3.eth.getGasPrice();
    console.log(gasprice);
    var howtotransfer = {
      from : ownerAddress,
      nonce : web3.utils.toHex(count),
      gasLimit : web3.utils.toHex(2500000),
      gasPrice : web3.utils.toHex(gasprice*1.30),
      to : deployeContractdAddress,
      data : trx
    }
    var privatekey =  new Buffer.from('7958cb545ad3be8ad142a8f632c7c7cc5c8bc18bdd098f69998ee026e4fa525a', 'hex');
    var tx = new TX(howtotransfer, {'chain': 'rinkeby' });
    tx.sign(privatekey);
    var serializedtransaction = tx.serialize().toString('hex');
    try{
      const results = await web3.eth.sendSignedTransaction('0x' + serializedtransaction);
      console.log(results);
    }
    catch(e){
      console.log(e);
    }
  } ;
  //details();

async function setGameContractAddress (_address){
  try{
    let gameAddress = await _interact.methods.setGameContractAddress(_address).encodeABI();
    runCode(gameAddress);
  }
  catch(e){
    throw{ message : "Contract not set"};
  }
}

async function tokenCreate(_address, tokenType, tokenValue){
    try{
    let creation = await _interact.methods.createToken (_address, tokenType, tokenValue).encodeABI();
    runCode(creation);
    }
    catch (e){
      throw{ message : "Token not created"};
    }
 }
 
async function remove(tokenId){
   try{
    let cardDelete = await _interact.methods.burn(tokenId).encodeABI();
    runCode(cardDelete);
   }
    catch (e){
      throw{ message : "Token not burn"};
    }
 }
 
 async function details(tokeId){
  try{
   var cardType;
   cardType = await _interact.methods.tokenDetails(tokeId).call();
   //It will return both type and value both respectively 
   //transaction(trx);
   console.log(cardType);
   return (cardType);
  }
  catch (e) {
    throw{ message : "Token details not given"};
  }
}

async function returnOwnedToken(_address){
  try{
    let owner = await _interact.methods.returnOwnedToken(_address).call();
    console.log(owner);
    return owner;
  }
  catch(e){
    throw{message : "Owner not returned"};
  }
}

async function tokenCount(_address, tokenId, isTotalCard){
  //isTotalCard is a bool value
   try{
    let count = await _interact.methods.returnTokenCount(_address, tokenId, isTotalCard).call();
    //transaction(trx);
    console.log(count);
    return count;
   }
   catch(e){
     throw{ message : "Token count not return"};
   }
 }
 
 async function owner(tokeId){
   try{
    let cardOwner = await _interact.methods.ownerOf(tokeId).call();
    //transaction(trx);
    console.log(cardOwner) ;
    return cardOwner;
   }
   catch (e){
     throw{ message : "Does not return owner"};
   }
}

async function transfer(_address,tokeId){
  try{
    let transfer = await _interact.methods.transfer(_address,tokeId).encodeABI();
    runCode(transfer);
  }
  catch(e){
    throw{ message : "Transfer not successfull"};
  }
}

async function safeTransferFrom(_address, __address, tokenId){
  try{
    let transfer = await _interact.methods.safeTransferFrom(_address, __address, tokenId).encodeABI();
    runCode(transfer);
  }
  catch(e){
    throw{message : "Transfer not successfull"};
  }
}

// Below anyone line need to be execute

/*tokenCreate('0x63580a35A6B6Da5c13c1Bf9c62C51FbCe64c806F', 1,30);
owner(1);
details(1);
tokenCount('0x63580a35A6B6Da5c13c1Bf9c62C51FbCe64c806F',1,true); */
