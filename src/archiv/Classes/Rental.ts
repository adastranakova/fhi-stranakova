import { Bike } from './Bike';
import { User } from './User';

// bicykel, pouzivatel, zaciatok, koniec
export class Rental {
    private bike: Bike;
    private user: User;
    private startTime: Date;
    private endTime: Date | undefined;

    constructor(bike: Bike, user: User) {
        this.bike = bike;
        this.user = user;
        this.startTime = new Date();
    }

    // funkcie
    getBike(): Bike {
        return this.bike;
    }

    getDuration(): number {
        if (this.endTime) {
            return this.endTime.getTime() - this.startTime.getTime();
        }
        return new Date().getTime() - this.startTime.getTime();
    }

    getUser() {
        return this.user;
    }
}
