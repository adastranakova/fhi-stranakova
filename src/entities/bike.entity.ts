export interface BikeEntity {
    id: string;
    status: BikeStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum BikeStatus {
    Available = 'AVAILABLE',
    Rented = 'RENTED',
    Maintenance = 'MAINTENANCE'
}

export interface BikeDTO {
    id: string;
    status: BikeStatus;
}

export interface CreateBikeInput {
    id: string;
}