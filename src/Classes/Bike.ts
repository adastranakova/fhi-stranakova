import {BikeStatus} from './BikeStatus';

// bicykel - ten ma svoje id a status z triedy BikeStatus
export class Bike {
    private id: string;
    private status: BikeStatus;

    constructor(id: string) {
        this.id = id;
        this.status = BikeStatus.Available;
    }

    // funkcie pre triedu bicykel
    getId(): string {
        return this.id;
    }
    getStatus(): BikeStatus {
        return this.status;
    }

    setStatus(status: BikeStatus): void {
        this.status = status;
    }

    isAvailable(): boolean {
        return this.status === BikeStatus.Available;
    }
}
