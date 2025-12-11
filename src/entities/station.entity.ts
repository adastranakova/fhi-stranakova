export interface StationEntity {
    id: number;
    name: string;
    address: string;
    numberOfSlots: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface StationDTO {
    name: string;
    address: string;
    numberOfSlots: number;
    availableBikes: number;
}

export interface CreateStationInput {
    name: string;
    address: string;
    numberOfSlots: number;
}

export interface UpdateStationInput {
    newName?: string;
    address?: string;
}