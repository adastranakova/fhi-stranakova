import { SlotStatus } from './SlotStatus';
import { Bike } from './Bike';

export class Slot {
    private slotNumber: number;
    private bike: Bike | undefined;
    private password: string | undefined;
    private status: SlotStatus;

    constructor(slotNumber: number) {
        this.slotNumber = slotNumber;
        this.status = SlotStatus.Empty;
    }

    getSlotNumber(): number {
        return this.slotNumber;
    }

    isEmpty(): boolean {
        return this.status === SlotStatus.Empty;
    }

    isOccupied(): boolean {
        return this.status === SlotStatus.Occupied;
    }

    isFaulty(): boolean {
        return this.status === SlotStatus.Faulty;
    }

    isOperational(): boolean {
        return this.status !== SlotStatus.Faulty;
    }

    lockBike(bike: Bike): string | undefined {
        if (!this.isOperational() || !this.isEmpty()) {
            return undefined;
        }
        this.bike = bike;
        this.password = this.generatePassword();
        this.status = SlotStatus.Occupied;
        return this.password;
    }

    validatePassword(password: string): boolean {
        return password === this.password;
    }

    unlockBike(password: string): Bike | undefined {
        if (this.validatePassword(password) && this.isOccupied()) {
            const bike = this.bike;
            this.bike = undefined;
            this.password = undefined;
            this.status = SlotStatus.Empty;
            return bike;
        }
        return undefined;
    }

    getBike(): Bike | undefined {
        return this.bike;
    }

    private generatePassword(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
}