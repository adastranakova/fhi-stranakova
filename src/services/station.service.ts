import { Request, Response } from 'express';
import { Station } from '../Classes/Station';
import { saveStation, findStationByName, findAllStations } from '../Storage/station.storage';
import { findBikeById } from '../Storage/bike.storage';

export const getAllStations = (req: Request, res: Response): void => {
    const stations = findAllStations();
    const stationsData = stations.map(station => ({
        name: station.getName(),
        address: station.getAddress(),
        availableBikes: station.getAvailableCount()
    }));
    res.json(stationsData);
};

export const getStationByName = (req: Request, res: Response): void => {
    // @ts-ignore
    const station = findStationByName(req.params.name);
    if (station) {
        res.json({
            name: station.getName(),
            address: station.getAddress(),
            availableBikes: station.getAvailableCount()
        });
    } else {
        res.status(404).json({ error: 'Station not found' });
    }
};

export const createStation = (req: Request, res: Response): void => {
    const { name, address, numberOfSlots } = req.body;

    if (!name || !address || !numberOfSlots) {
        res.status(400).json({ error: 'Name, address, and numberOfSlots are required' });
        return;
    }

    if (findStationByName(name)) {
        res.status(400).json({ error: 'Station already exists' });
        return;
    }

    const station = new Station(name, address, numberOfSlots);
    saveStation(station);
    res.status(201).json({ name, address, numberOfSlots });
};

export const lockBikeInStation = (req: Request, res: Response): void => {
    // @ts-ignore
    const station = findStationByName(req.params.name);
    const { bikeId, slotNumber } = req.body;

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const bike = findBikeById(bikeId);
    if (!bike) {
        res.status(404).json({ error: 'Bike not found' });
        return;
    }

    const password = station.lockBikeInSlot(slotNumber, bike);
    if (password) {
        res.json({ password, slotNumber });
    } else {
        res.status(400).json({ error: 'Could not lock bike in slot' });
    }
};

export const unlockBikeFromStation = (req: Request, res: Response): void => {
    // @ts-ignore
    const station = findStationByName(req.params.name);
    const { password } = req.body;

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const bike = station.unlockBikeFromSlot(password);
    if (bike) {
        res.json({ bikeId: bike.getId() });
    } else {
        res.status(400).json({ error: 'Invalid password or no bike found' });
    }
};
