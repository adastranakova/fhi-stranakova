import {RentalEntity} from "../entities/rental.entity";

const rentals: Map<number, RentalEntity> = new Map();
let nextRentalId = 1;

export const createRental = (
    userId: number,
    bikeId: string,
    startStationId: number
): RentalEntity => {
    const rental: RentalEntity = {
        id: nextRentalId++,
        userId,
        bikeId,
        startStationId,
        startTime: new Date(),
        endTime: null,
        endStationId: null,
        duration: null,
        cost: null
    };
    rentals.set(rental.id, rental);
    return rental;
};

export const findRentalById = (id: number): RentalEntity | null => {
    return rentals.get(id) || null;
};

export const findActiveRentalByUserId = (userId: number): RentalEntity | null => {
    return Array.from(rentals.values()).find(
        r => r.userId === userId && r.endTime === null
    ) || null;
};

export const findActiveRentalByBikeId = (bikeId: string): RentalEntity | null => {
    return Array.from(rentals.values()).find(
        r => r.bikeId === bikeId && r.endTime === null
    ) || null;
};

export const findAllActiveRentals = (): RentalEntity[] => {
    return Array.from(rentals.values()).filter(r => r.endTime === null);
};

export const findRentalsByUserId = (userId: number): RentalEntity[] => {
    return Array.from(rentals.values()).filter(r => r.userId === userId);
};

export const findAllRentals = (): RentalEntity[] => {
    return Array.from(rentals.values());
};

export const completeRental = (
    rentalId: number,
    endStationId: number,
    cost: number
): RentalEntity | null => {
    const rental = rentals.get(rentalId);
    if (!rental || rental.endTime !== null) return null;

    const endTime = new Date();
    const duration = endTime.getTime() - rental.startTime.getTime();

    rental.endTime = endTime;
    rental.endStationId = endStationId;
    rental.duration = duration;
    rental.cost = cost;

    rentals.set(rentalId, rental);
    return rental;
};

export const deleteRental = (id: number): boolean => {
    return rentals.delete(id);
};

export const userHasActiveRental = (userId: number): boolean => {
    return Array.from(rentals.values()).some(
        r => r.userId === userId && r.endTime === null
    );
};

export const bikeIsRented = (bikeId: string): boolean => {
    return Array.from(rentals.values()).some(
        r => r.bikeId === bikeId && r.endTime === null
    );
};

export const calculateCost = (durationMs: number): number => {
    const minutes = Math.floor(durationMs / 60000);
    // First 30 minutes free, then $0.15 per minute
    return Math.max(0, (minutes - 30) * 0.15);
};

export const clearAllRentals = (): void => {
    rentals.clear();
    nextRentalId = 1;
};
