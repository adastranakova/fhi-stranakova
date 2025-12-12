import { Request, Response } from 'express';
import * as rentalRepo from '../repositories/rental.repository';
import * as userRepo from '../repositories/user.repository';
import * as bikeRepo from '../repositories/bike.repository';
import * as stationRepo from '../repositories/station.repository';
import {BikeStatus} from "../entities/bike.entity";

export const rentBike = async (req: Request, res: Response): Promise<void> => {
    const { memberId, bikeId } = req.body;

    if (!memberId || !bikeId) {
        res.status(400).json({ error: 'Member ID and Bike ID are required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const hasActiveRental = await rentalRepo.userHasActiveRental(user.id);
        if (hasActiveRental) {
            res.status(400).json({ error: 'User already has an active rental' });
            return;
        }

        const bike = await bikeRepo.findBikeById(bikeId);
        if (!bike) {
            res.status(404).json({ error: 'Bike not found' });
            return;
        }

        if (bike.status !== BikeStatus.Available) {
            res.status(400).json({ error: `Bike is ${bike.status}, not available for rent` });
            return;
        }

        const slot = await stationRepo.findSlotByBikeId(bikeId);
        if (!slot) {
            res.status(404).json({ error: 'Bike not found in any station' });
            return;
        }

        // 5. Create rental
        const rental = await rentalRepo.createRental(user.id, bikeId, slot.stationId);

        // 6. Update bike status to RENTED
        await bikeRepo.updateBikeStatus(bikeId, BikeStatus.Rented);

        // 7. Clear bike from slot (user has it now)
        await stationRepo.clearSlot(slot.id);

        res.json({
            message: 'Bike rented successfully',
            rentalId: rental.id,
            bikeId: bikeId,
            startTime: rental.startTime
        });

    } catch (error) {
        console.error('Error renting bike:', error);
        res.status(500).json({ error: 'Failed to rent bike' });
    }
};

export const returnBike = async (req: Request, res: Response): Promise<void> => {
    const { memberId, stationName } = req.body;

    if (!memberId || !stationName) {
        res.status(400).json({ error: 'Member ID and station name are required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const station = await stationRepo.findStationByName(stationName);
        if (!station) {
            res.status(404).json({ error: 'Station not found' });
            return;
        }

        const rental = await rentalRepo.findActiveRentalByUserId(user.id);
        if (!rental) {
            res.status(400).json({ error: 'No active rental found for this user' });
            return;
        }

        const now = new Date();
        const start = new Date(rental.startTime);
        const durationMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);

        // First 30 minutes free, then $0.15/min
        const cost = Math.max(0, (durationMinutes - 30) * 0.15);

        const currentBalance = Number(user.balance);
        if (currentBalance < cost) {
            res.status(400).json({
                error: 'Insufficient balance',
                balance: currentBalance,
                cost: cost
            });
            return;
        }

        const emptySlot = await stationRepo.findEmptySlotByStationId(station.id);
        if (!emptySlot) {
            res.status(400).json({ error: 'No empty slots available at this station' });
            return;
        }

        await rentalRepo.completeRental(rental.id, station.id, durationMinutes, cost);

        await userRepo.deductFunds(user.id, cost);

        await stationRepo.putBikeInSlot(emptySlot.id, rental.bikeId);

        await bikeRepo.updateBikeStatus(rental.bikeId, BikeStatus.Available);

        const updatedUser = await userRepo.findUserById(user.id);

        res.json({
            message: 'Bike returned successfully',
            bikeId: rental.bikeId,
            duration: durationMinutes,
            cost: cost,
            slotNumber: emptySlot.slotNumber,
            balance: Number(updatedUser?.balance ?? 0)
        });

    } catch (error) {
        console.error('Error returning bike:', error);
        res.status(500).json({ error: 'Failed to return bike' });
    }
};

export const getAllActiveRentals = async (req: Request, res: Response): Promise<void> => {
    try {
        const rentals = await rentalRepo.findAllActiveRentals();
        res.json(rentals);
    } catch (error) {
        console.error('Error fetching active rentals:', error);
        res.status(500).json({ error: 'Failed to fetch active rentals' });
    }
};

export const getActiveRental = async (req: Request, res: Response): Promise<void> => {
    const { memberId } = req.params;

    if (!memberId) {
        res.status(400).json({ error: 'Member ID is required' });
        return;
    }

    try {
        const user = await userRepo.findUserByMemberId(memberId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const rental = await rentalRepo.findActiveRentalByUserId(user.id);
        if (!rental) {
            res.status(404).json({ error: 'No active rental found' });
            return;
        }

        res.json(rental);
    } catch (error) {
        console.error('Error fetching active rental:', error);
        res.status(500).json({ error: 'Failed to fetch active rental' });
    }
};
