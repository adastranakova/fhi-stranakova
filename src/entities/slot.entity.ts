export interface SlotEntity {
    id: number;
    slotNumber: number;
    stationId: number;
    bikeId: string | null;
    password: string | null;
    status: SlotStatus;
}

export enum SlotStatus {
    Empty = 'EMPTY',
    Occupied = 'OCCUPIED',
    Faulty = 'FAULTY' // nakoniec nepouzivam
}
