const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server";
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
let web3;
let accounts;
let currentUser;
const BUDSaddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const ATYLAaddress = "0x8fd5f66668eacD509cc92E9cf3D0a0eB3de78772";
const NFT_ADDRESS = "0x007fe8A4b56BDe96C71262D6fFbb7A72AC9a78d9";

async function init(){
    currentUser = Moralis.User.current();
    if (!currentUser){
        await alert("Sing in with Metamask in homepage");
        // window.location.pathname = "/Web/index.html";
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.enableWeb3();
    // web3 = await Moralis.Web3.enable();
    accounts = await web3.eth.getAccounts();


    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token-id-input").value = nftId;
    document.getElementById("address-input").value = accounts[0];
}

async function mintBackedBUSD(){
    let tokenId = parseInt(document.getElementById("token-id-input").value);
    let address = document.getElementById("address-input").value;
    let amount = parseInt(document.getElementById("amount-input").value);
    let tokenPrice;

    const NFTcontract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    tokenPrice = await NFTcontract.methods.getPrice(tokenId).call();
    tokenPrice = tokenPrice.toString();

    const BUSDtoken = new web3.eth.Contract(ERC20_ABI, BUDSaddress);
    await BUSDtoken.methods.approve(NFT_ADDRESS, tokenPrice).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });

    
    await NFTcontract.methods.mintBackedBUSD(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Purchase completed")
    })
}

async function mintBackedATYLA(){
    let tokenId = parseInt(document.getElementById("token-id-input").value);
    let address = document.getElementById("address-input").value;
    let amount = parseInt(document.getElementById("amount-input").value);
    let tokenPrice;

    const NFTcontract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    tokenPrice = await NFTcontract.methods.getPrice(tokenId).call();
    totalPrice = tokenPrice * amount;
    totalPrice = totalPrice.toString();

    const ATYLAtoken = new web3.eth.Contract(ERC20_ABI, ATYLAaddress);
    await ATYLAtoken.methods.approve(NFT_ADDRESS, totalPrice).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });

    await NFTcontract.methods.mintBackedATYLA(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Purchase completed")
    })
}

async function mint(){
    let token = document.getElementById("token-input").value.toString();
    if (token == "BUSD"){
        console.log("BUSD");
        mintBackedBUSD();
    } else if (token == "ATYLA"){
        console.log("ATYLA");
        mintBackedATYLA();
    }
}


document.getElementById("pay").onclick = mint;

init();
