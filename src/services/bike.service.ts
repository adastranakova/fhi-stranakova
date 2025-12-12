import { Request, Response } from 'express';
import * as bikeRepo from '../repositories/bike.repository';
import {BikeStatus} from "../entities/bike.entity";

// vyuzitie async - z obycajnej hodnoty vrati promise
// await - sluzi na pockanie vysledku asynchronnej operacie aka napr praca s databazou, API
// nemusim then() vyuzivat
// Promise - pri vyuziti databazy => vysledok nie je dostupny ihned, aby sme si neblokovali vykonavanie kodu
// Promise - pending, fulfilled, rejected

export const getAllBikes = async (req: Request, res: Response): Promise<void> => {
    try {
        // kod sa pozastavi (len tato funkcia), kym databaza nevrati data
        // findAllBikes napr vracia promise - await pocka, kym sa Promise fulfillne a vysledok da do bikes
        const bikes = await bikeRepo.findAllBikes();
        res.json(bikes.map(bike => ({ id: bike.id, status: bike.status })));
    } catch (error) {
        console.error('Error fetching bikes:', error);
        res.status(500).json({ error: 'Failed to fetch bikes' });
    }
};

export const getBikeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    try {
        const bike = await bikeRepo.findBikeById(id);
        if (bike) {
            res.json({ id: bike.id, status: bike.status });
        } else {
            res.status(404).json({ error: 'Bike not found' });
        }
    } catch (error) {
        console.error('Error fetching bike:', error);
        res.status(500).json({ error: 'Failed to fetch bike' });
    }
};

export const createBike = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    try {
        if (await bikeRepo.bikeExists(id)) {
            res.status(400).json({ error: 'Bike already exists' });
            return;
        }

        const bike = await bikeRepo.createBike(id);
        res.status(201).json({ id: bike.id, status: bike.status });
    } catch (error) {
        console.error('Error creating bike:', error);
        res.status(500).json({ error: 'Failed to create bike' });
    }
};

export const updateBikeStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    const validStatuses: BikeStatus[] = [
        BikeStatus.Available,
        BikeStatus.Rented,
        BikeStatus.Maintenance
    ];

    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
    }

    try {
        const bike = await bikeRepo.updateBikeStatus(id, status);
        if (!bike) {
            res.status(404).json({ error: 'Bike not found' });
            return;
        }
        res.json({ id: bike.id, status: bike.status });
    } catch (error) {
        console.error('Error updating bike:', error);
        res.status(500).json({ error: 'Failed to update bike' });
    }
};

export const deleteBikeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    try {
        const deleted = await bikeRepo.deleteBike(id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Bike not found' });
        }
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ error: 'Failed to delete bike' });
    }
};