const connectBtn = document.getElementById('connectBtn');
const switchBtn = document.getElementById('switchBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const addressP = document.getElementById('address');
const networkP = document.getElementById('network');

const baseChainId = '0x2105'; // Hex for 8453 (Base Mainnet)

let provider;
let signer;

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        addressP.innerText = `Address: ${address.slice(0, 6)}...${address.slice(-4)}`;
        networkP.innerText = `Network: ${network.name}`;
        
        walletInfoDiv.classList.remove('hidden');
        connectBtn.style.display = 'none';

    } catch (error) {
        console.error(error);
        alert("Failed to connect wallet.");
    }
}

async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseChainId }],
        });
        // Refresh info after switching
        connectWallet();
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            alert("Base network is not added to your MetaMask. Please add it manually.");
        } else {
            console.error(switchError);
            alert("Failed to switch network.");
        }
    }
}

connectBtn.addEventListener('click', connectWallet);
switchBtn.addEventListener('click', switchNetwork);
