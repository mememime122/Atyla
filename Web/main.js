const serverUrl = "https://rk0bbjwxgtyy.usemoralis.com:2053/server";
const appId = "A2FOUzXZbFyMxBZJUvPVvguhGLLMyuURgUJvwwsN"; 
Moralis.start({ serverUrl, appId });
let currentUser;

async function logIn() {

    var loginBTN = document.getElementById("login-button");
    if (loginBTN != null){
        loginBTN.parentNode.removeChild(loginBTN);
    }

    currentUser = Moralis.User.current();
    if (!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }

    const parent = document.getElementById("logs")
    let htmlString = "Sign out"
    let logoutBTN = document.createElement("button");
    logoutBTN.id = "logout-button"
    logoutBTN.innerHTML = htmlString;
    parent.appendChild(logoutBTN);

    document.getElementById("logout-button").onclick = logOut;
}

async function logOut() {
    var logoutBTN = document.getElementById("logout-button");
    if  (logoutBTN != null) {
        logoutBTN.parentNode.removeChild(logoutBTN);
    }

    Moralis.User.logOut().then(() => {
        const currentUser = Moralis.User.current();  // this will now be null
    });

    const parent = document.getElementById("logs")
    let htmlString = "Sign in with MetaMask"
    let loginBTN = document.createElement("button");
    loginBTN.id = "login-button"
    loginBTN.innerHTML = htmlString;
    parent.appendChild(loginBTN);

    document.getElementById("login-button").onclick = logIn;
}

async function initializeApp() {
    currentUser = Moralis.User.current();
    if (!currentUser){
        await logOut();
    }else{
        await logIn();
    }
}

initializeApp();
