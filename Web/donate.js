
const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server";
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
// Moralis.enableWeb3();
let web3;
let accounts;
let currentUser;
const BUDSaddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const DONATE_ADDRESS = "0x64AD9F4544D2ACB06FF8c1Fb4D2F964D146EFC66";

async function init(){
    currentUser = await Moralis.User.current();
    console.log(currentUser)
    if (!currentUser){
        await alert("Sing in with Metamask in homepage");
        // window.location.pathname = "/Web/index.html";
        window.location.pathname = "/index.html";
    }
    
    web3 = await Moralis.enableWeb3();
    // web3 = await Moralis.Web3.enable();
    accounts = await web3.eth.getAccounts();
}

async function donate(){
    let amount = parseInt(document.getElementById("donate-input").value) * 10 ** 18;
    amount = amount.toString();
    console.log(amount);

    const BUSDtoken = new web3.eth.Contract(ERC20_ABI, BUDSaddress);
    await BUSDtoken.methods.approve(DONATE_ADDRESS , amount).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });

    const donateContract = new web3.eth.Contract(DONATE_ABI, DONATE_ADDRESS)
    await donateContract.methods.donate(amount).send({from: accounts[0]})
    .on("receipt", function(receipt){
        alert("Donation done")
    })    
}

async function buyAtyla(){
    let amount = parseInt(document.getElementById("buy-input").value) * 10 ** 18;
    amount = amount.toString();
    console.log(amount);
    
    const BUSDtoken = new web3.eth.Contract(ERC20_ABI, BUDSaddress);
    await BUSDtoken.methods.approve(DONATE_ADDRESS , amount).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });

    const donateContract = new web3.eth.Contract(DONATE_ABI, DONATE_ADDRESS)
    await donateContract.methods.buyATYLA(amount).send({from: accounts[0]})
    .on("receipt", function(receipt){
        alert("Purchase done")
    })   
}

document.getElementById("donate-BUSD").onclick = donate;
document.getElementById("buy-ATYLA").onclick = buyAtyla;

init();
