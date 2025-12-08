import { Request, Response } from 'express';
import { Bike } from '../Classes/Bike';
import { saveBike, findBikeById, findAllBikes, removeBike } from '../Storage/bike.storage';

export const getAllBikes = (req: Request, res: Response): void => {
    const bikes = findAllBikes();
    const bikesData = bikes.map(bike => ({
        id: bike.getId(),
        status: bike.getStatus()
    }));
    res.json(bikesData);
};

export const getBikeById = (req: Request, res: Response): void => {
    // @ts-ignore
    const bike = findBikeById(req.params.id);
    if (bike) {
        res.json({ id: bike.getId(), status: bike.getStatus() });
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
    res.status(201).json({ id: bike.getId(), status: bike.getStatus() });
};

export const updateBikeStatus = (req: Request, res: Response): void => {
    console.log('Received request to update bike:', req.params.id, 'to status:', req.body.status);
    // @ts-ignore
    const bike = findBikeById(req.params.id);
    const { status } = req.body;

    if (!bike) {
        console.log('Bike not found');
        res.status(404).json({ error: 'Bike not found' });
        return;
    }

    const validStatuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE'];
    if (!validStatuses.includes(status)) {
        console.log('Invalid status:', status);
        res.status(400).json({ error: 'Invalid status' });
        return;
    }

    bike.setStatus(status);
    saveBike(bike);
    console.log('Status updated successfully');
    res.json({ id: bike.getId(), status: bike.getStatus() });
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