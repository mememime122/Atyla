const serverUrl = "https://lx3g75cvrci5.usemoralis.com:2053/server";
const appId = "tqrVSeL5yA3ksENJpe7Mci2Zww7EJFDLsS2RLwOc";
Moralis.start({ serverUrl, appId });
const CONTRACT_ADDRESS = "0x4f3013736eead635f9bce3371f22a0e6d20a8dc7";
let currentUser;

function renderInventory(NFTs, ownerData){
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++){
        const nft = NFTs[i];
        let htmlString = `
        <div class="card">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <p class="card-text">Total supply: ${nft.amount}</p>
                <p class="card-text">Number of owners: ${nft.owners.length}</p>
                <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                <a href="mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
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
    const options = { chain: 'bsc testnet', address: accounts[0], token_address: CONTRACT_ADDRESS };
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
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = { address: CONTRACT_ADDRESS,
    chain: "bsc testnet" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await NFTs.result
    for (let i = 0; i < NFTWithMetadata.length; i++){
        NFTWithMetadata[i].metadata = JSON.parse(NFTWithMetadata[i].metadata);
        const options = { address: CONTRACT_ADDRESS, 
            token_id: NFTWithMetadata[i].token_id, chain: "bsc testnet"};
        let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
        let tokenIdOwnersArray = tokenIdOwners.result;

        NFTWithMetadata[i].owners = tokenIdOwnersArray;

        //The code below is intended to store an array of owners in NFTWithMetadata[i].owners, but doesn't work
        // NFTWithMetadata[i].owners = [];
        // console.log(NFTWithMetadata[i].owners);
        // for (let owner_i = 0; i < tokenIdOwnersArray.length; owner_i++){
        //     console.log(tokenIdOwnersArray[owner_i].owner_of);
        //     // console.log( NFTWithMetadata[i].owners);
        //     // console.log( NFTWithMetadata[i].owners);
        //     NFTWithMetadata[i].owners.push(tokenIdOwnersArray[owner_i].owner_of);
        //     console.log(NFTWithMetadata[i].owners)
        //     console.log("--------")
        // }
        // console.log(NFTWithMetadata[i].owners);
    }

    // const option = { address: CONTRACT_ADDRESS, 
    //     token_id: NFTWithMetadata[1].token_id, chain: "bsc testnet"};
    // let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(option);
    // console.log(tokenIdOwners.result);

    //console.log(NFTWithMetadata);
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();