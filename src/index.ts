// import potrebnych tried
import {BikeShareSystem} from "./Classes/BikeShareSystem";
import {Station} from "./Classes/Station";
import {Bike} from "./Classes/Bike";
import {User} from "./Classes/User";
import {Account} from "./Classes/Account";
import {BikeStatus} from "./Classes/BikeStatus";

// Create the bike share system
const cityBikes = new BikeShareSystem("CityBikes");
console.log("=== Bike Share System Created ===\n");

// Create stations with slots
const centralStation = new Station("Central Station", "123 Main St", 5);
const parkStation = new Station("Park Station", "456 Park Ave", 3);

cityBikes.addStation(centralStation);
cityBikes.addStation(parkStation);
console.log("Created 2 stations:");
console.log(`  - ${centralStation.getName()} with 5 slots`);
console.log(`  - ${parkStation.getName()} with 3 slots\n`);

// Create bikes and lock them in slots at Central Station
const bike1 = new Bike("BIKE001");
const bike2 = new Bike("BIKE002");
const bike3 = new Bike("BIKE003");

const password1 = centralStation.lockBikeInSlot(1, bike1);
const password2 = centralStation.lockBikeInSlot(2, bike2);
const password3 = centralStation.lockBikeInSlot(3, bike3);

console.log("=== Bikes Added to Central Station ===");
console.log(`Bike ${bike1.getId()} locked in slot 1, password: ${password1}`);
console.log(`Bike ${bike2.getId()} locked in slot 2, password: ${password2}`);
console.log(`Bike ${bike3.getId()} locked in slot 3, password: ${password3}`);
console.log(`Available bikes at Central: ${centralStation.getAvailableCount()}\n`);

// Create users and accounts
const user1 = new User("Alice Smith", "alice@email.com", "MEM001");
const user2 = new User("Bob Jones", "bob@email.com", "MEM002");

const account1 = new Account(user1);
const account2 = new Account(user2);

account1.addFunds(50);
account2.addFunds(30);

cityBikes.addAccount(account1);
cityBikes.addAccount(account2);

console.log("=== Users Created ===");
console.log(`  ${user1.getName()} - Balance: $${account1.getBalance()}`);
console.log(`  ${user2.getName()} - Balance: $${account2.getBalance()}\n`);

// Alice rents a bike
console.log("=== Alice Rents a Bike ===");
const rental1 = cityBikes.rentBike(account1, centralStation, password1!);
if (rental1) {
    console.log(`${user1.getName()} rented ${rental1.getBike().getId()}`);
    console.log(`  Bike status: ${rental1.getBike().getStatus()}`);
    console.log(`  Has active rental: ${account1.hasActiveRental()}`);
    console.log(`  Available bikes at Central: ${centralStation.getAvailableCount()}\n`);
}

// Bob tries to rent with wrong password
console.log("=== Bob Tries Wrong Password ===");
const failedRental = cityBikes.rentBike(account2, centralStation, "9999");
if (!failedRental) {
    console.log("Failed to rent bike - wrong password\n");
}

// Bob rents with correct password
console.log("=== Bob Rents a Bike ===");
const rental2 = cityBikes.rentBike(account2, centralStation, password2!);
if (rental2) {
    console.log(`  ${user2.getName()} rented ${rental2.getBike().getId()}`);
    console.log(`  Available bikes at Central: ${centralStation.getAvailableCount()}\n`);
}

// Alice returns the bike to Park Station
console.log("=== Alice Returns Bike to Park Station ===");
const returnPassword1 = cityBikes.returnBike(account1, parkStation);
if (returnPassword1 && rental1) {
    console.log(`  Bike returned successfully`);
    console.log(`  New password for slot: ${returnPassword1}`);
    console.log(`  Bike status: ${rental1.getBike().getStatus()}`);
    console.log(`  Alice has active rental: ${account1.hasActiveRental()}`);
    console.log(`  Balance after ride: $${account1.getBalance()}`);
    console.log(`  Available bikes at Park Station: ${parkStation.getAvailableCount()}\n`);
}

// Bob returns his bike to Central Station
console.log("=== Bob Returns His Bike ===");
const returnPassword2 = cityBikes.returnBike(account2, centralStation);
if (returnPassword2) {
    console.log(`  ${user2.getName()} returned bike`);
    console.log(`  New password: ${returnPassword2}`);
    console.log(`  Balance after ride: $${account2.getBalance()}`);
    console.log(`  Available bikes at Central: ${centralStation.getAvailableCount()}\n`);
}

// Set a bike to maintenance status (just showing status change)
console.log("=== Bike Status Change ===");
bike3.setStatus(BikeStatus.Maintenance);
console.log(`  ${bike3.getId()} status changed to: ${bike3.getStatus()}`);
console.log(`  Is available: ${bike3.isAvailable()}\n`);

// Final system status
console.log("=== Final System Status ===");
console.log(`Central Station:`);
console.log(`  - Available bikes: ${centralStation.getAvailableCount()}`);
console.log(`\nPark Station:`);
console.log(`  - Available bikes: ${parkStation.getAvailableCount()}`);
console.log(`\nUser Accounts:`);
console.log(`  - ${user1.getName()}: $${account1.getBalance()} (Active rental: ${account1.hasActiveRental()})`);
console.log(`  - ${user2.getName()}: $${account2.getBalance()} (Active rental: ${account2.hasActiveRental()})`);