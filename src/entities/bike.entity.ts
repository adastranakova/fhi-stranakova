export interface BikeEntity {
    id: string;
    status: BikeStatus;
}

// status bicyklov - v systeme sa medzi nimi budeme cyklovat
export enum BikeStatus {
    Available = 'AVAILABLE',
    Rented = 'RENTED',
    Maintenance = 'MAINTENANCE'
}
