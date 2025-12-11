import { User } from './User';
import { Rental } from './Rental';

// ucet - pouzivatel, prostriedky, aktivne pozicania
export class Account {
    private user: User;
    private balance: number;
    private activeRental: Rental | undefined;

    constructor(user: User) {
        this.user = user;
        this.balance = 0;
    }

    // funkcie
    getUser(): User {
        return this.user;
    }

    getBalance(): number {
        return this.balance;
    }

    addFunds(amount: number): void {
        this.balance += amount;
    }

    deductFunds(amount: number): boolean {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    startRental(rental: Rental): void {
        this.activeRental = rental;
    }

    endRental(): void {
        if (this.activeRental) {
            this.activeRental = undefined;
        }
    }

    getActiveRental(): Rental | undefined {
        return this.activeRental;
    }

    hasActiveRental(): boolean {
        return this.activeRental !== undefined;
    }
}