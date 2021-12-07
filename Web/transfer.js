// can't transfer token 0, probably due to error inside Moralis.transfer(options);


const serverUrl = "https://lx3g75cvrci5.usemoralis.com:2053/server";
const appId = "tqrVSeL5yA3ksENJpe7Mci2Zww7EJFDLsS2RLwOc";
Moralis.start({ serverUrl, appId });
const CONTRACT_ADDRESS = "0x4f3013736eead635f9bce3371f22a0e6d20a8dc7";
Moralis.enableWeb3();
//Moralis.authenticate();

async function init(){
    let currentUser = Moralis.User.current();
    if (!currentUser){
        window.location.pathname = "/index.html";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer(){
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    
    const options = {type: "erc1155",  
    receiver: address,
    contractAddress: CONTRACT_ADDRESS,
    tokenId: tokenId,
    amount: amount}
    //console.log(options)
    let result = await Moralis.transfer(options);
    //console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();
