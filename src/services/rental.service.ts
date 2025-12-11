import { Request, Response } from 'express';
import { BikeShareSystem } from '../archiv/Classes/BikeShareSystem';
import { findAccountByMemberId } from '../archiv/Storage/user.storage';
import { findStationByName } from '../archiv/Storage/station.storage';

const bikeShareSystem = new BikeShareSystem("CityBikes");

export const rentBike = (req: Request, res: Response): void => {
    const { memberId, stationName, password } = req.body;

    if (!memberId || !stationName || !password) {
        res.status(400).json({ error: 'MemberId, stationName, and password are required' });
        return;
    }

    const account = findAccountByMemberId(memberId);
    const station = findStationByName(stationName);

    if (!account) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const rental = bikeShareSystem.rentBike(account, station, password);
    if (rental) {
        res.json({
            bikeId: rental.getBike().getId(),
            memberId: rental.getUser().getMemberId(),
            status: 'rented'
        });
    } else {
        res.status(400).json({ error: 'Could not rent bike' });
    }
};

export const returnBike = (req: Request, res: Response): void => {
    const { memberId, stationName } = req.body;

    if (!memberId || !stationName) {
        res.status(400).json({ error: 'MemberId and stationName are required' });
        return;
    }

    const account = findAccountByMemberId(memberId);
    const station = findStationByName(stationName);

    if (!account) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const password = bikeShareSystem.returnBike(account, station);
    if (password) {
        res.json({
            password,
            balance: account.getBalance(),
            status: 'returned'
        });
    } else {
        res.status(400).json({ error: 'Could not return bike' });
    }
};

export const getActiveRental = (req: Request, res: Response): void => {
    const { memberId } = req.params;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    const account = findAccountByMemberId(memberId);

    if (!account) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const rental = account.getActiveRental();
    if (rental) {
        res.json({
            bikeId: rental.getBike().getId(),
            duration: Math.floor(rental.getDuration() / 60000)
        });
    } else {
        res.json({ message: 'No active rental' });
    }
};