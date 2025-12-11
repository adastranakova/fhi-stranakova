import {BikeEntity, BikeStatus} from "../entities/bike.entity";

const bikes: Map<string, BikeEntity> = new Map();

export const createBike = (id: string): BikeEntity => {
    const bike: BikeEntity = {
        id,
        status: BikeStatus.Available,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    bikes.set(id, bike);
    return bike;
};

export const findBikeById = (id: string): BikeEntity | null => {
    return bikes.get(id) || null;
};

export const findAllBikes = (): BikeEntity[] => {
    return Array.from(bikes.values());
};

export const findBikesByStatus = (status: BikeStatus): BikeEntity[] => {
    return Array.from(bikes.values()).filter(bike => bike.status === status);
};

export const updateBikeStatus = (id: string, status: BikeStatus): BikeEntity | null => {
    const bike = bikes.get(id);
    if (!bike) return null;

    bike.status = status;
    bike.updatedAt = new Date();
    bikes.set(id, bike);
    return bike;
};

export const deleteBike = (id: string): boolean => {
    return bikes.delete(id);
};

export const bikeExists = (id: string): boolean => {
    return bikes.has(id);
};

export const clearAllBikes = (): void => {
    bikes.clear();
};
