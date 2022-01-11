const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server";
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
let web3;
let accounts;
let currentUser;
const BUDSaddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const ATYLAaddress = "0x8fd5f66668eacD509cc92E9cf3D0a0eB3de78772";
const RAFFLE_ADDRESS = "0xc09E34a0373b6477417E0fb7Bb75255B61a05006";

async function init(){
    currentUser = Moralis.User.current();
    if (!currentUser){
        await alert("Sing in with Metamask in homepage");
        // window.location.pathname = "/Web/index.html";
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.enableWeb3();
    accounts = await web3.eth.getAccounts();

    const urlParams = new URLSearchParams(window.location.search);
    const raffleId = urlParams.get("raffleId");
    console.log(raffleId);
    document.getElementById("id-input").value = raffleId;
    getRaffleInfo();
}

async function getRaffleInfo(){
    let raffleId = parseInt(document.getElementById("id-input").value);
    
    const raffleContract = new web3.eth.Contract(RAFFLE_ABI, RAFFLE_ADDRESS);
    let myTicketNum = await raffleContract.methods.getTMyTicketNum(raffleId).call({from: accounts[0]});
    let totalTicketNum = await raffleContract.methods.getTotalTicketNum(raffleId).call();
    let targetTicketNum = await raffleContract.methods.getTargetTicketNum(raffleId).call();

    myTicketNum = parseFloat(myTicketNum);
    totalTicketNum = parseFloat(totalTicketNum);
    targetTicketNum = parseFloat(targetTicketNum);

    if(parseInt(totalTicketNum / targetTicketNum * 100) < 100){
        document.getElementById("ticket-target").style = "width: " + parseInt(totalTicketNum / targetTicketNum * 100).toString() + "%";
    }else{
        document.getElementById("ticket-target").style = "width: " + parseInt(100).toString() + "%";
    }

    document.getElementById("my-tickets").style = "width: " + parseInt(myTicketNum / totalTicketNum * 100).toString() + "%";
    document.getElementById("others-tickets").style = "width: " + parseInt((totalTicketNum - myTicketNum) / totalTicketNum * 100).toString() + "%";
}

async function buyWithBUSD() {
    let raffleId = parseInt(document.getElementById("id-input").value);
    let amount = parseInt(document.getElementById("amount-input").value) * 10 ** 18;
    amount = amount.toString();
    console.log(amount);

    const BUSDtoken = new web3.eth.Contract(ERC20_ABI, BUDSaddress);
    await BUSDtoken.methods.approve(RAFFLE_ADDRESS, amount).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });
    
    const raffleContract = new web3.eth.Contract(RAFFLE_ABI, RAFFLE_ADDRESS);
    await raffleContract.methods.buyWithBUSD(raffleId, amount).send({from: accounts[0]})
    .on("receipt", function(receipt){
        alert("Tickets purchased")
    })
}

async function buyWithATYLA() {
    let raffleId = parseInt(document.getElementById("id-input").value);
    let amount = parseInt(document.getElementById("amount-input").value) * 10 ** 18;
    amount = amount.toString();
    console.log(amount);

    const ATYLAtoken = new web3.eth.Contract(ERC20_ABI, ATYLAaddress);
    await ATYLAtoken.methods.approve(RAFFLE_ADDRESS, amount).send({from: accounts[0]}).on("receipt", function(receipt){
        console.log("Got the transaction receipt: ", receipt)
    });
    
    const raffleContract = new web3.eth.Contract(RAFFLE_ABI, RAFFLE_ADDRESS);
    await raffleContract.methods.buyWithATYLA(raffleId, amount).send({from: accounts[0]})
    .on("receipt", function(receipt){
        alert("Tickets purchased")
    })
}

async function buyTickets(){
    let token = document.getElementById("token-input").value.toString();
    if (token == "BUSD"){
        console.log("BUSD");
        buyWithBUSD();
    } else if (token == "ATYLA"){
        console.log("ATYLA");
        buyWithATYLA();
    }
    getRaffleInfo()
}

document.getElementById("pay").onclick = buyTickets;

init();

