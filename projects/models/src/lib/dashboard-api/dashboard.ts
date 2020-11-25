export interface Dashboard {
    id: number;
    name: string;
    height: number;
    width: number;
}

export interface DashboardTile {
    id: number;
    name: string;
    position: {
            left: number,
            top: number,
            right: number,
            bottom: number
    };
}

