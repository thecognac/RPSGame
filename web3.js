const Web3 = require('web3');
const TX = require("ethereumjs-tx");
//const { interface, bytecode} = require('./compile');

var trx;
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

var _interact = new web3.eth.Contract(interface, '0x9F0A14b16E84B71E5f48CF3B9635ec4F2eC7143E');


const transaction = async(trx) =>{
    const accounts = await web3.eth.getAccounts();
    var count = await web3.eth.getTransactionCount("0x63580a35A6B6Da5c13c1Bf9c62C51FbCe64c806F");

    
    const gasprice = await web3.eth.getGasPrice();
    console.log(gasprice);
    var howtotransfer = {
      from : '0x63580a35A6B6Da5c13c1Bf9c62C51FbCe64c806F',
      nonce : web3.utils.toHex(count),
      gasLimit : web3.utils.toHex(2500000),
      gasPrice : web3.utils.toHex(gasprice*1.30),
      to : '0x9F0A14b16E84B71E5f48CF3B9635ec4F2eC7143E',
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
  tokenCreate();

  async function tokenCreate(){
    try{
    trx= await _interact.methods.createToken ('0x114dF342f9649f66E3e670bA29418b4693Fe3dA3' ,2 ,20 ).encodeABI();
   transaction(trx);
    }
    catch (e){
      throw{ message : "Token not created"};
    }
 }
 
 async function remove(){
   try{
    trx = await _interact.methods.burn('0x114dF342f9649f66E3e670bA29418b4693Fe3dA3',19).encodeABI();
    transaction(trx);
   }
    catch (e){
      throw{ message : "Token not burn"};
    }
 }
 
 async function tokenCount(){
   try{
    trx = await _interact.methods.returnTokenCount('0xf158F22ec9ef60A64F83Cf2BD59F6b5554E9caC4', 1,true).encodeABI();
    transaction(trx);
   }
   catch(e){
     throw{ message : "Token count not return"};
   }
 }
 
 async function details(){
   try{
    trx = await _interact.methods.tokenDetails(1).encodeABI();
    transaction(trx);
   }
   catch(e){
     throw{ message : "Token details not given"};
   }
 }
 
 async function owner(){
   try{
    trx = await _interact.methods.ownerOf(1).encodeABI();
    transaction(trx);
   }
   catch (e){
     throw{ message : "Does not return owner"};
   }
}


/* web3.eth.sendSignedTransaction('0x' + serialisedTransaction).on('receipt', receipt => {
            console.log(receipt);
            contract.methods.showAvailableToken().call().then(v => console.log("Value after increment: " + v));
          });
          
  const contract = new web3.eth.Contract(abi, '0x0FAAd85289390e3Ba8e53F51De7d02aC991a6d8F', {
    from: '0xf158F22ec9ef60A64F83Cf2BD59F6b5554E9caC4',
    gasLimit: 3000000,
  });
  
  //privatekey 1d74031771cabab38b07d31937bdcf279c712f0e2f358c1072bc0cf27898e004
          
*/