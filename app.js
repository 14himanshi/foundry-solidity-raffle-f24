const raffleAddress = "YOUR_CONTRACT_ADDRESS";
const raffleABI = [
    // Add your contract's ABI here
];

let provider;
let signer;
let raffleContract;

// Connect wallet function
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        document.getElementById("account").textContent = await signer.getAddress();
        raffleContract = new ethers.Contract(raffleAddress, raffleABI, signer);
        updateUI();
    } else {
        alert("Please install MetaMask!");
    }
}

// Update UI with contract information
async function updateUI() {
    const entranceFee = await raffleContract.getEntranceFee();
    const raffleState = await raffleContract.getRaffleState();
    const recentWinner = await raffleContract.getRecentWinner();
    const numPlayers = await raffleContract.s_playersLength();  // Assumes you have a function for this

    document.getElementById("entranceFee").textContent = ethers.utils.formatEther(entranceFee) + " ETH";
    document.getElementById("raffleStatus").textContent = raffleState === 0 ? "OPEN" : "CALCULATING";
    document.getElementById("recentWinner").textContent = recentWinner;
    document.getElementById("numPlayers").textContent = numPlayers;
}

// Enter raffle function
async function enterRaffle() {
    const entranceFee = await raffleContract.getEntranceFee();
    try {
        const tx = await raffleContract.enterRaffle({ value: entranceFee });
        await tx.wait();
        alert("Entered Raffle!");
        updateUI();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Event listeners
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("enterBtn").addEventListener("click", enterRaffle);
