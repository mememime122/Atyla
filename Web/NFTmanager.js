const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server"; 
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
// const NFT_ADDRESS = "0x4f3013736eead635f9bce3371f22a0e6d20a8dc7";
const NFT_ADDRESS = "0x007fe8A4b56BDe96C71262D6fFbb7A72AC9a78d9";
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

function fetchNFTMetadata(NFTs){
    let promises = [];
    for (let i = 0; i < NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://rk0bbjwxgtyy.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then( () => {return nft;}));
    }
    return Promise.all(promises);
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
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result)
    
    for (let i = 0; i < NFTWithMetadata.length; i++){
        const optionsOwners = { address: NFT_ADDRESS, 
            token_id: NFTWithMetadata[i].token_id, chain: "bsc testnet"};
        let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(optionsOwners);
        let tokenIdOwnersArray = tokenIdOwners.result;

        NFTWithMetadata[i].owners = tokenIdOwnersArray;
    }
    await console.log(NFTWithMetadata)
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();
