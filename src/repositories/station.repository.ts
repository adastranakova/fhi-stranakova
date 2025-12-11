import {StationEntity} from "../entities/station.entity";
import {SlotEntity, SlotStatus} from "../entities/slot.entity";

const stations: Map<number, StationEntity> = new Map();
const slots: Map<number, SlotEntity> = new Map();
let nextStationId = 1;
let nextSlotId = 1;

export const createStation = (name: string, address: string, numberOfSlots: number): StationEntity => {
    const station: StationEntity = {
        id: nextStationId++,
        name,
        address,
        numberOfSlots,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    stations.set(station.id, station);

    // vytvori sloty pre stanicu
    for (let i = 1; i <= numberOfSlots; i++) {
        createSlot(station.id, i);
    }

    return station;
};

export const findStationById = (id: number): StationEntity | null => {
    return stations.get(id) || null;
};

export const findStationByName = (name: string): StationEntity | null => {
    return Array.from(stations.values()).find(s => s.name === name) || null;
};

export const findAllStations = (): StationEntity[] => {
    return Array.from(stations.values());
};

export const updateStation = (id: number, updates: { name?: string; address?: string }): StationEntity | null => {
    const station = stations.get(id);
    if (!station) return null;

    if (updates.name) station.name = updates.name;
    if (updates.address) station.address = updates.address;
    station.updatedAt = new Date();

    stations.set(id, station);
    return station;
};

export const deleteStation = (id: number): boolean => {
    // vymaze vsetky sloty
    const stationSlots = findSlotsByStationId(id);
    stationSlots.forEach(slot => slots.delete(slot.id));

    return stations.delete(id);
};

export const deleteStationByName = (name: string): boolean => {
    const station = findStationByName(name);
    if (!station) return false;
    return deleteStation(station.id);
};

export const stationExistsByName = (name: string): boolean => {
    return Array.from(stations.values()).some(s => s.name === name);
};

export const createSlot = (stationId: number, slotNumber: number): SlotEntity => {
    const slot: SlotEntity = {
        id: nextSlotId++,
        slotNumber,
        stationId,
        bikeId: null,
        password: null,
        status: SlotStatus.Empty
    };
    slots.set(slot.id, slot);
    return slot;
};

export const findSlotById = (id: number): SlotEntity | null => {
    return slots.get(id) || null;
};

export const findSlotsByStationId = (stationId: number): SlotEntity[] => {
    return Array.from(slots.values()).filter(s => s.stationId === stationId);
};

export const findSlotByStationAndNumber = (stationId: number, slotNumber: number): SlotEntity | null => {
    return Array.from(slots.values()).find(
        s => s.stationId === stationId && s.slotNumber === slotNumber
    ) || null;
};

export const findEmptySlotByStationId = (stationId: number): SlotEntity | null => {
    return Array.from(slots.values()).find(
        s => s.stationId === stationId && s.status === SlotStatus.Empty
    ) || null;
};

export const findSlotByPassword = (stationId: number, password: string): SlotEntity | null => {
    return Array.from(slots.values()).find(
        s => s.stationId === stationId && s.password === password
    ) || null;
};

export const lockBikeInSlot = (slotId: number, bikeId: string, password: string): SlotEntity | null => {
    const slot = slots.get(slotId);
    if (!slot || slot.status !== SlotStatus.Empty) return null;

    slot.bikeId = bikeId;
    slot.password = password;
    slot.status = SlotStatus.Occupied;

    slots.set(slotId, slot);
    return slot;
};

export const unlockBikeFromSlot = (slotId: number): SlotEntity | null => {
    const slot = slots.get(slotId);
    if (!slot || slot.status !== SlotStatus.Occupied) return null;

    slot.bikeId = null;
    slot.password = null;
    slot.status = SlotStatus.Empty;

    slots.set(slotId, slot);
    return slot;
};

export const getAvailableBikesCount = (stationId: number): number => {
    return Array.from(slots.values()).filter(
        s => s.stationId === stationId && s.status === SlotStatus.Occupied && s.bikeId !== null
    ).length;
};

export const generatePassword = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const clearAllStations = (): void => {
    stations.clear();
    slots.clear();
    nextStationId = 1;
    nextSlotId = 1;
};
