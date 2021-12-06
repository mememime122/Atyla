const serverUrl = "https://lx3g75cvrci5.usemoralis.com:2053/server";
const appId = "tqrVSeL5yA3ksENJpe7Mci2Zww7EJFDLsS2RLwOc";
Moralis.start({ serverUrl, appId });

function renderInventory(NFTs){
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++){
        const nft = NFTs[i];
        let htmlString = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}Card title</h5>
                <p class="card-text">${nft.metadata.description}Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-3"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}


async function initializeApp() {
    let currentUser = Moralis.User.current();
    if (!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = { address: "0x4f3013736eead635f9bce3371f22a0e6d20a8dc7",
    chain: "bsc testnet" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await NFTs.result
    for (let i = 0; i < NFTWithMetadata.length; i++){
        NFTWithMetadata[i].metadata = JSON.parse(NFTWithMetadata[i].metadata);
    }
    renderInventory(NFTWithMetadata);
}

initializeApp();