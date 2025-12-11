import { Request, Response } from 'express';
import * as stationRepo from '../repositories/station.repository';
import * as bikeRepo from '../repositories/bike.repository';

export const getAllStations = (req: Request, res: Response): void => {
    const stations = stationRepo.findAllStations();

    const stationsData = stations.map(station => ({
        name: station.name,
        address: station.address,
        numberOfSlots: station.numberOfSlots,
        availableBikes: stationRepo.getAvailableBikesCount(station.id)
    }));

    res.json(stationsData);
};

export const getStationByName = (req: Request, res: Response): void => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    const station = stationRepo.findStationByName(name);

    if (station) {
        res.json({
            name: station.name,
            address: station.address,
            numberOfSlots: station.numberOfSlots,
            availableBikes: stationRepo.getAvailableBikesCount(station.id)
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

    if (numberOfSlots <= 0) {
        res.status(400).json({ error: 'Number of slots must be greater than 0' });
        return;
    }

    if (stationRepo.stationExistsByName(name)) {
        res.status(400).json({ error: 'Station already exists' });
        return;
    }

    const station = stationRepo.createStation(name, address, numberOfSlots);

    res.status(201).json({
        name: station.name,
        address: station.address,
        numberOfSlots: station.numberOfSlots
    });
};

export const updateStation = (req: Request, res: Response): void => {
    const { name } = req.params;
    const { newName, address } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    const station = stationRepo.findStationByName(name);

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    // kontrola nazvu stanice - ci uz taka neexistuje
    if (newName && newName !== station.name && stationRepo.stationExistsByName(newName)) {
        res.status(400).json({ error: 'Station with this name already exists' });
        return;
    }

    const updates: { name?: string; address?: string } = {};
    if (newName && newName !== station.name) updates.name = newName;
    if (address && address !== station.address) updates.address = address;

    if (Object.keys(updates).length === 0) {
        res.json({
            name: station.name,
            address: station.address,
            numberOfSlots: station.numberOfSlots
        });
        return;
    }

    const updatedStation = stationRepo.updateStation(station.id, updates);

    if (updatedStation) {
        res.json({
            name: updatedStation.name,
            address: updatedStation.address,
            numberOfSlots: updatedStation.numberOfSlots
        });
    } else {
        res.status(500).json({ error: 'Failed to update station' });
    }
};

export const deleteStation = (req: Request, res: Response): void => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    const deleted = stationRepo.deleteStationByName(name);

    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Station not found' });
    }
};

export const getStationSlots = (req: Request, res: Response): void => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    const station = stationRepo.findStationByName(name);

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const slots = stationRepo.findSlotsByStationId(station.id);

    const slotsData = slots.map(slot => ({
        slotNumber: slot.slotNumber,
        isEmpty: slot.bikeId === null,
        bikeId: slot.bikeId,
        status: slot.status
    }));

    res.json({
        name: station.name,
        slots: slotsData
    });
};

export const lockBikeInStation = (req: Request, res: Response): void => {
    const { name } = req.params;
    const { bikeId, slotNumber } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    if (!bikeId || !slotNumber) {
        res.status(400).json({ error: 'Bike ID and slot number are required' });
        return;
    }

    const station = stationRepo.findStationByName(name);

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const bike = bikeRepo.findBikeById(bikeId);

    if (!bike) {
        res.status(404).json({ error: 'Bike not found' });
        return;
    }

    const slot = stationRepo.findSlotByStationAndNumber(station.id, slotNumber);

    if (!slot) {
        res.status(404).json({ error: 'Slot not found' });
        return;
    }

    if (slot.bikeId !== null) {
        res.status(400).json({ error: 'Slot is already occupied' });
        return;
    }

    const password = stationRepo.generatePassword();
    const updatedSlot = stationRepo.lockBikeInSlot(slot.id, bikeId, password);

    if (updatedSlot) {
        res.json({
            password,
            slotNumber: updatedSlot.slotNumber,
            bikeId: updatedSlot.bikeId
        });
    } else {
        res.status(400).json({ error: 'Could not lock bike in slot' });
    }
};

export const unlockBikeFromStation = (req: Request, res: Response): void => {
    const { name } = req.params;
    const { password } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    const station = stationRepo.findStationByName(name);

    if (!station) {
        res.status(404).json({ error: 'Station not found' });
        return;
    }

    const slot = stationRepo.findSlotByPassword(station.id, password);

    if (!slot) {
        res.status(400).json({ error: 'Invalid password' });
        return;
    }

    const bikeId = slot.bikeId;
    const updatedSlot = stationRepo.unlockBikeFromSlot(slot.id);

    if (updatedSlot && bikeId) {
        res.json({ bikeId });
    } else {
        res.status(400).json({ error: 'Could not unlock bike' });
    }
};