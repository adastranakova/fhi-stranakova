import { User } from './User';
import { Rental } from './Rental';

export class Account {
    private user: User;
    private balance: number;
    private activeRental: Rental | undefined;
    private rentalHistory: Rental[];

    constructor(user: User) {
        this.user = user;
        this.balance = 0;
        this.rentalHistory = [];
    }

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
            this.rentalHistory.push(this.activeRental);
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