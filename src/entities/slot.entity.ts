export interface SlotEntity {
    id: number;
    slotNumber: number;      // Cislo slotu (1, 2, 3...)
    stationId: number;       // CK -> stations.id
    bikeId: string | null;   // CK -> bikes.id
    password: string | null; // 4 ciselne heslo
    status: SlotStatus;
}

export enum SlotStatus {
    Empty = 'EMPTY',
    Occupied = 'OCCUPIED',
    Faulty = 'FAULTY'
}

export interface SlotDTO {
    slotNumber: number;
    isEmpty: boolean;
    bikeId: string | null;
}