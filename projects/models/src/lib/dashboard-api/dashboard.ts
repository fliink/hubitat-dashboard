import { HubitatDevice } from '../maker-api/device.model';

export interface Dashboard {
    id: number;
    name: string;
    height: number;
    width: number;
    tiles: DashboardTile[];
}

export interface DashboardTile {
    id: number;
    type: string;
    name: string;
    device: HubitatDevice;
    position: {
            left: number,
            top: number,
            right: number,
            bottom: number
    };
}

