export interface RentalEntity {
    id: number;              // autoinkrement
    userId: number;          // CK -> users.id
    bikeId: string;          // CK -> bikes.id
    startStationId: number;  // CK -> stations.id (kde bol bicykel pozicany)
    startTime: Date;
    endTime: Date | null;    // null pokial nie je vrateny
    endStationId: number | null; // kde bol bicykel vrateny (null pokial nie je vrateny)
    duration: number | null; // pri vrateni sa vypocita (milisekundy)
    cost: number | null;     // cena v dolaroch (pri vrateni sa pocita)
}
