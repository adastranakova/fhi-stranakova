import { Request, Response } from 'express';
import * as bikeRepo from '../repositories/bike.repository';
import {BikeStatus} from "../entities/bike.entity";

export const getAllBikes = (req: Request, res: Response): void => {
    const bikes = bikeRepo.findAllBikes();

    const bikesData = bikes.map(bike => ({
        id: bike.id,
        status: bike.status
    }));

    res.json(bikesData);
};

export const getBikeById = (req: Request, res: Response): void => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    const bike = bikeRepo.findBikeById(id);

    if (bike) {
        res.json({
            id: bike.id,
            status: bike.status
        });
    } else {
        res.status(404).json({ error: 'Bike not found' });
    }
};

export const createBike = (req: Request, res: Response): void => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    if (bikeRepo.bikeExists(id)) {
        res.status(400).json({ error: 'Bike already exists' });
        return;
    }

    const bike = bikeRepo.createBike(id);

    res.status(201).json({
        id: bike.id,
        status: bike.status
    });
};

export const updateBikeStatus = (req: Request, res: Response): void => {
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

    const bike = bikeRepo.updateBikeStatus(id, status);

    if (!bike) {
        res.status(404).json({ error: 'Bike not found' });
        return;
    }

    res.json({
        id: bike.id,
        status: bike.status
    });
};

export const deleteBikeById = (req: Request, res: Response): void => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Bike ID is required' });
        return;
    }

    const deleted = bikeRepo.deleteBike(id);

    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Bike not found' });
    }
};