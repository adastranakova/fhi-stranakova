import { Slot } from './Slot';
import { Bike } from './Bike';

// stanica ma svoje meno, adresu/lokaciu, sloty do ktorych davame bicykle
export class Station {
    private name: string;
    private address: string;
    private slots: Slot[];

    constructor(name: string, address: string, numberOfSlots: number) {
        this.name = name;
        this.address = address;
        this.slots = [];

        for (let i = 1; i <= numberOfSlots; i++) {
            this.slots.push(new Slot(i));
        }
    }

    // funkcie
    getName(): string {
        return this.name;
    }

    lockBikeInSlot(slotNumber: number, bike: Bike): string | undefined {
        const slot = this.slots.find(s => s.getSlotNumber() === slotNumber);
        if (slot && slot.isEmpty()) {
            return slot.lockBike(bike);
        }
        return undefined;
    }

    unlockBikeFromSlot(password: string): Bike | undefined {
        const slot = this.slots.find(s => s.validatePassword(password));
        if (slot) {
            return slot.unlockBike(password);
        }
        return undefined;
    }

    getAvailableBikes(): Bike[] {
        return this.slots
            .filter(s => !s.isEmpty())
            .map(s => s.getBike())
            .filter(b => b !== undefined && b.isAvailable()) as Bike[];
    }

    getAvailableCount(): number {
        return this.getAvailableBikes().length;
    }

    findEmptySlot(): Slot | undefined {
        return this.slots.find(s => s.isEmpty());
    }

    getAddress() {
        return this.address;
    }
}
