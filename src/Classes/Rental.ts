import { Bike } from './Bike';
import { User } from './User';
import { Station } from './Station';

export class Rental {
    private bike: Bike;
    private user: User;
    private startStation: Station;
    private endStation: Station | undefined;
    private startTime: Date;
    private endTime: Date | undefined;
    private unlockPassword: string;

    constructor(bike: Bike, user: User, startStation: Station, unlockPassword: string) {
        this.bike = bike;
        this.user = user;
        this.startStation = startStation;
        this.unlockPassword = unlockPassword;
        this.startTime = new Date();
    }

    getBike(): Bike {
        return this.bike;
    }

    endRental(endStation: Station): void {
        this.endStation = endStation;
        this.endTime = new Date();
    }

    getDuration(): number {
        if (this.endTime) {
            return this.endTime.getTime() - this.startTime.getTime();
        }
        return new Date().getTime() - this.startTime.getTime();
    }
}
