const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server";
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
const NFT_ADDRESS = "0x4f3013736eead635f9bce3371f22a0e6d20a8dc7";
// const NFT_ADDRESS = "0x007fe8A4b56BDe96C71262D6fFbb7A72AC9a78d9";
let currentUser;

function renderInventory(NFTs, ownerData){
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++){
        const nft = NFTs[i];
        console.log(nft);
        ownerBalance = ownerData[nft.token_id];
        if (ownerData[nft.token_id] == undefined){
            ownerBalance = 0;
        }
        let htmlString = `
        <div class="card">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <p class="card-text">Total supply: ${nft.amount}</p>
                <p class="card-text">Number of owners: ${nft.owners.length}</p>
                <p class="card-text">Your balance: ${ownerBalance}</p>
                <a href="mint.html?nftId=${nft.token_id}" class="btn btn-primary">Buy</a>
                <a href="transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-3"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

async function getOwnerData(){
    let accounts = currentUser.get("accounts");
    const options = { chain: 'bsc testnet', address: accounts[0], token_address: NFT_ADDRESS };
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce( (object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {});
        return result;
    } );
}


async function initializeApp() {

    currentUser = Moralis.User.current();
    if (!currentUser){
        await alert("Sing in with Metamask in homepage");
        // window.location.pathname = "/Web/index.html";
        window.location.pathname = "/index.html";
    }

    const options = { address: NFT_ADDRESS,
    chain: "bsc testnet" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await NFTs.result
    await console.log(NFTWithMetadata)
    for (let i = 0; i < NFTWithMetadata.length; i++){
        NFTWithMetadata[i].metadata = JSON.parse(NFTWithMetadata[i].metadata);
        // const optionsMetadata = { address: NFT_ADDRESS,
        //     chain: "bsc testnet" };
        // let metadata = await Moralis.Web3API.token.getNFTMetadata(optionsMetadata);
        // console.log("Metadata result:", metadata.result)
        // NFTWithMetadata[i].metadata = await metadata.result;

        const optionsOwners = { address: NFT_ADDRESS, 
            token_id: NFTWithMetadata[i].token_id, chain: "bsc testnet"};
        let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(optionsOwners);
        let tokenIdOwnersArray = tokenIdOwners.result;

        NFTWithMetadata[i].owners = tokenIdOwnersArray;
    }
    
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();
