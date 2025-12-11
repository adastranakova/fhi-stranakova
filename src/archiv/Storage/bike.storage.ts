import { Bike } from '../Classes/Bike';

// kedze nepouzivame realnu databazu tak Map nam sluzi ako docasna databaza v pameti servera
const bikes: Map<string, Bike> = new Map();

export const saveBike = (bike: Bike): void => {
    bikes.set(bike.getId(), bike);
};

export const findBikeById = (id: string): Bike | undefined => {
    return bikes.get(id);
};

export const findAllBikes = (): Bike[] => {
    return Array.from(bikes.values());
};

export const removeBike = (id: string): boolean => {
    return bikes.delete(id);
};
