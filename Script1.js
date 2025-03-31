//variables
let gymPurchased = false; // Tracks whether the gym membership is purchased
let energyLevel = 0;
let maxEnergy = 10;
let sleeping = false;
let sleepInterval;
let money = 0; // Initial money amount
let cashierActive = false; // Tracks whether the Cashier job is toggled
let cashierInterval;


// Function to toggle between tabs
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-buttons button');

    // Hide all tab content and remove active class from buttons
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    // Show the clicked tab and add active class to the button
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function toggleSleep() {
    const sleepButton = document.getElementById("sleep-button");
    const cashierButton = document.getElementById("cashier-button");

    if (cashierActive) {
        // Stop working as a Cashier if currently working
        cashierActive = false;
        cashierButton.textContent = "Cashier";
        clearInterval(cashierInterval);
    }

    if (!sleeping) {
        // Start sleeping
        sleeping = true;
        sleepButton.textContent = "Stop Sleeping";
        sleepButton.classList.add("toggled"); // Add blue styling
        sleepInterval = setInterval(() => {
            if (energyLevel < maxEnergy) {
                energyLevel += 1; // Restore 1 energy per second
                updateProgressBar();
            } else {
                toggleSleep(); // Stop sleeping when energy is full
            }
        }, 1000);
    } else {
        // Stop sleeping
        sleeping = false;
        sleepButton.textContent = "Start Sleeping";
        sleepButton.classList.remove("toggled"); // Remove blue styling
        clearInterval(sleepInterval);
    }
}
    function updateProgressBar() {
        const progressBar = document.getElementById("progress-bar");
        const energyDisplay = document.getElementById("energy-display");
        const energyPercent = (energyLevel / maxEnergy) * 100;
        progressBar.style.width = energyPercent + "%";
        energyDisplay.textContent = `${energyLevel} / ${maxEnergy}`;
    }



function toggleCashier() {
    const cashierButton = document.getElementById("cashier-button");
    const sleepButton = document.getElementById("sleep-button");

    if (sleeping) {
        // Stop sleeping if currently sleeping
        sleeping = false;
        sleepButton.textContent = "Start Sleeping";
        sleepButton.classList.remove("toggled"); // Remove blue styling
        clearInterval(sleepInterval);
    }

    if (!cashierActive) {
        // Start working as a Cashier
        if (energyLevel > 0) {
            cashierActive = true;
            cashierButton.textContent = "Stop Cashier";
            cashierInterval = setInterval(() => {
                if (energyLevel > 0) {
                    money += 1; // Earn 1 money per second
                    energyLevel -= 1; // Deduct 1 energy per second
                    updateMoneyDisplay();
                    updateProgressBar();
                } else {
                    // Stop working if energy runs out
                    toggleCashier();
                }
            }, 1000);
        } else {
            addToLog("Not enough energy to work!");
        }
    } else {
        // Stop working as a Cashier
        cashierActive = false;
        cashierButton.textContent = "Cashier";
        clearInterval(cashierInterval);
    }
}

function updateMoneyDisplay() {
    const moneyDisplay = document.getElementById("money-display");
    moneyDisplay.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> ${money}`; // Display the dollar icon and the number
}

function purchaseGymMembership() {
    const gymButton = document.getElementById("gym-button");
    const gymStatus = document.getElementById("gym-status");
    const cardioButton = document.getElementById("cardio-button"); // Reference the Cardio button

    if (money >= 25 && !gymPurchased) {
        money -= 25; // Deduct 25 money
        gymPurchased = true; // Mark gym membership as purchased
        updateMoneyDisplay(); // Update money display
        addToLog("Gym membership purchased successfully!"); // Log the success message
        gymButton.remove(); // Remove the button from the DOM
        cardioButton.disabled = false; // Enable the Cardio button
    } else if (gymPurchased) {
        addToLog("You already own a gym membership!"); // Log the duplicate purchase message
    } else {
        addToLog("Not enough money to purchase a gym membership!"); // Log the insufficient funds message
    }
}

function addToLog(message) {
    const logList = document.getElementById("log-list");
    const logItem = document.createElement("li");
    logItem.textContent = message; // Add the message content
    logList.appendChild(logItem); // Add the message to the list
}
function clearLog() {
    const logList = document.getElementById("log-list");
    logList.innerHTML = ""; // Remove all log entries
}

// Save All Data (excluding the log data)
function saveAllData() {
    // Gather all relevant data to save (excluding the log)
    const allData = {
        money: money,
        gymPurchased: gymPurchased,
        energyLevel: energyLevel,
        maxEnergy: maxEnergy,
    };

    // Save data to localStorage
    localStorage.setItem("gameData", JSON.stringify(allData));
    addToLog("All data (excluding the log) has been saved to the browser!");
}

// Load All Data
function loadAllData() {
    const savedData = localStorage.getItem("gameData");

    if (savedData) {
        // Parse saved data
        const allData = JSON.parse(savedData);

        // Restore variables
        money = allData.money || 0;
        gymPurchased = allData.gymPurchased || false;
        energyLevel = allData.energyLevel || 50;

        // Update UI elements
        updateMoneyDisplay();
        if (gymPurchased) {
            const cardioButton = document.getElementById("cardio-button");
            if (cardioButton) cardioButton.disabled = false; // Enable Cardio button
        }

        addToLog("All data (excluding the log) has been loaded from the browser!");
    }
}

// Clear All Data
function clearAllData() {
    // Remove data from localStorage
    localStorage.removeItem("gameData");

    // Reset variables to defaults
    money = 0;
    gymPurchased = false;
    energyLevel = 50;

    // Clear UI elements
    updateMoneyDisplay();
    const cardioButton = document.getElementById("cardio-button");
    if (cardioButton) cardioButton.disabled = true; // Disable Cardio button

    addToLog("All saved data has been cleared!");
}

// Initialize content display explicitly when the page loads
document.querySelectorAll('.content').forEach((content) => {
    content.style.display = 'block'; // Ensure it starts as visible
});

function toggleContent(element) {
    const content = element.querySelector('.content');
    const icon = element.querySelector('.toggle-icon');

    if (element.classList.contains('open')) {
        element.classList.remove('open'); // Remove 'open' class
        content.style.display = 'none';  // Collapse content
    } else {
        element.classList.add('open'); // Add 'open' class
        content.style.display = 'block'; // Expand content
    }
}





