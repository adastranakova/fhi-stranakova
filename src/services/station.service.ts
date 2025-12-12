import { Request, Response } from 'express';
import * as stationRepo from '../repositories/station.repository';
import * as bikeRepo from '../repositories/bike.repository';

export const getAllStations = async (req: Request, res: Response): Promise<void> => {
    try {
        const stations = await stationRepo.findAllStations();

        const stationsWithSlots = await Promise.all(
            stations.map(async (station) => {
                const slots = await stationRepo.findSlotsByStationId(station.id);
                const availableBikes = await stationRepo.getAvailableBikesCount(station.id);

                return {
                    name: station.name,
                    address: station.address,
                    numberOfSlots: station.numberOfSlots,
                    availableBikes,
                    slots: slots.map(slot => ({
                        slotNumber: slot.slotNumber,
                        bikeId: slot.bikeId,
                        status: slot.status
                    }))
                };
            })
        );

        res.json(stationsWithSlots);
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ error: 'Failed to fetch stations' });
    }
};

export const getStationByName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    try {
        const station = await stationRepo.findStationByName(name);
        if (!station) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        const slots = await stationRepo.findSlotsByStationId(station.id);
        const availableBikes = await stationRepo.getAvailableBikesCount(station.id);

        res.json({
            name: station.name,
            address: station.address,
            numberOfSlots: station.numberOfSlots,
            availableBikes,
            slots: slots.map(slot => ({
                slotNumber: slot.slotNumber,
                bikeId: slot.bikeId,
                status: slot.status
            }))
        });
    } catch (error) {
        console.error('Error fetching station:', error);
        res.status(500).json({ error: 'Failed to fetch station' });
    }
};

export const createStation = async (req: Request, res: Response): Promise<void> => {
    const { name, address, numberOfSlots } = req.body;

    if (!name || !address || !numberOfSlots) {
        res.status(400).json({ error: 'Name, address, and number of slots are required' });
        return;
    }

    if (numberOfSlots <= 0) {
        res.status(400).json({ error: 'Number of slots must be positive' });
        return;
    }

    try {
        const exists = await stationRepo.stationExistsByName(name);
        if (exists) {
            res.status(400).json({ error: 'Station with this name already exists' });
            return;
        }

        const station = await stationRepo.createStation(name, address, numberOfSlots);
        res.status(201).json(station);
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).json({ error: 'Failed to create station' });
    }
};

export const updateStation = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const { newName, address } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    if (!newName && !address) {
        res.status(400).json({ error: 'At least one field (newName or address) must be provided' });
        return;
    }

    try {
        const station = await stationRepo.findStationByName(name);
        if (!station) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        if (newName && newName !== name) {
            const exists = await stationRepo.stationExistsByName(newName);
            if (exists) {
                res.status(400).json({ error: 'Station with this name already exists' });
                return;
            }
        }

        const updated = await stationRepo.updateStation(station.id, newName, address);
        res.json(updated);
    } catch (error) {
        console.error('Error updating station:', error);
        res.status(500).json({ error: 'Failed to update station' });
    }
};

export const deleteStationByName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: 'Station name is required' });
        return;
    }

    try {
        const station = await stationRepo.findStationByName(name);
        if (!station) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        await stationRepo.deleteStation(station.id);
        res.json({ message: 'Station deleted successfully' });
    } catch (error) {
        console.error('Error deleting station:', error);
        res.status(500).json({ error: 'Failed to delete station' });
    }
};

