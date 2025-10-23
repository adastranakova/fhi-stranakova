import {BikeStatus} from './BikeStatus';
import { Station } from './Station';
import { Account } from './Account';
import { Rental } from './Rental';

export class BikeShareSystem {
    private name: string;
    private stations: Station[];
    private accounts: Account[];

    constructor(name: string) {
        this.name = name;
        this.stations = [];
        this.accounts = [];
    }

    addStation(station: Station): void {
        this.stations.push(station);
    }

    addAccount(account: Account): void {
        this.accounts.push(account);
    }

    rentBike(account: Account, station: Station, password: string): Rental | undefined {
        if (account.hasActiveRental()) {
            return undefined;
        }

        const bike = station.unlockBikeFromSlot(password);
        if (bike && bike.isAvailable()) {
            bike.setStatus(BikeStatus.Rented);
            const rental = new Rental(bike, account.getUser(), station, password);
            account.startRental(rental);
            return rental;
        }
        return undefined;
    }

    returnBike(account: Account, station: Station): string | undefined {
        const rental = account.getActiveRental();
        const emptySlot = station.findEmptySlot();

        if (!rental || !emptySlot) {
            return undefined;
        }

        const bike = rental.getBike();
        bike.setStatus(BikeStatus.Available);

        const password = station.lockBikeInSlot(emptySlot.getSlotNumber(), bike);
        if (password) {
            rental.endRental(station);
            account.endRental();

            const duration = rental.getDuration();
            const cost = this.calculateCost(duration);
            account.deductFunds(cost);

            return password;
        }

        return undefined;
    }

    private calculateCost(duration: number): number {
        const minutes = Math.floor(duration / 60000);
        return Math.max(0, (minutes - 30) * 0.15);
    }
}