import { Request, Response } from 'express';
import { Bike } from '../Classes/Bike';
import {BikeStatus} from "../Classes/BikeStatus";
import { saveBike, findBikeById, findAllBikes, removeBike } from '../Storage/bike.storage';

export const getAllBikes = (req: Request, res: Response): void => {
    const bikes = findAllBikes();
    res.json(bikes);
};

export const getBikeById = (req: Request, res: Response): void => {
    // @ts-ignore
    const bike = findBikeById(req.params.id);
    if (bike) {
        res.json(bike);
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

    if (findBikeById(id)) {
        res.status(400).json({ error: 'Bike already exists' });
        return;
    }

    const bike = new Bike(id);
    saveBike(bike);
    res.status(201).json(bike);
};

export const updateBikeStatus = (req: Request, res: Response): void => {
    // @ts-ignore
    const bike = findBikeById(req.params.id);
    const { status } = req.body;

    if (!bike) {
        res.status(404).json({ error: 'Bike not found' });
        return;
    }

    if (!Object.values(BikeStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
    }

    bike.setStatus(status);
    res.json(bike);
};

export const deleteBikeById = (req: Request, res: Response): void => {
    // @ts-ignore
    const deleted = removeBike(req.params.id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Bike not found' });
    }
};