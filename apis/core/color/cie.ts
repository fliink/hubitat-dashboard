export interface CIE {
    xy: XY;
    gamut: Gamut;
}

export interface XY {
    x: number;
    y: number;
}


export interface XYBright {
    x: number;
    y: number;
    brightness: number;
}

export interface Gamut {
    red: XY;
    green: XY;
    blue: XY;
}