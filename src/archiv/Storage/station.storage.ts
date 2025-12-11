import { Station } from '../Classes/Station';

const stations: Map<string, Station> = new Map();

export const saveStation = (station: Station): void => {
    stations.set(station.getName(), station);
};

export const findStationByName = (name: string): Station | undefined => {
    return stations.get(name);
};

export const findAllStations = (): Station[] => {
    return Array.from(stations.values());
};

export const removeStation = (name: string): boolean => {
    return stations.delete(name);
};
