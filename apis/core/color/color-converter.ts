import { Gamut, XY, XYBright } from "./cie";
import { RGBA } from "./rgb";


export function XYtoRGB(xy: XY, brightness: number = 1, model?: string, gamut?: Gamut): RGBA {
    
    const colorPoints = gamut || getColorPointsForModel(model);
    const inReachOfLamps = checkPointInLampsReach(xy, colorPoints);

    if (!inReachOfLamps) {
        const pAB: XY = getClosestPointToPoints(colorPoints.red, colorPoints.green, xy);
        const pAC: XY = getClosestPointToPoints(colorPoints.blue, colorPoints.red, xy);
        const pBC: XY = getClosestPointToPoints(colorPoints.green, colorPoints.blue, xy);

        const dAB: number = getDistanceBetweenTwoPoints(xy, pAB);
        const dAC: number = getDistanceBetweenTwoPoints(xy, pAC);
        const dBC: number = getDistanceBetweenTwoPoints(xy, pBC);
        let lowest = dAB;
        let closestPoint = pAB;

        if (dAC < lowest) {
            lowest = dAC;
            closestPoint = pAC;
        }

        if (dBC < lowest) {
            lowest = dBC;
            closestPoint = pBC;
        }

        xy.x = closestPoint.x;
        xy.y = closestPoint.y;
    }
    
    const x = xy.x;
    const y = xy.y;
    const z = 1.0 - x - y;

    const Y = brightness;
    const X = (Y / y) * x;
    const Z = (Y / y) * z;

    let r =  X *    1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X *    0.707196 + Y * 1.655397 + Z * 0.036152;
    let b =  X *    0.051713 - Y * 0.121364 + Z * 1.011530;

    
    if (r > b && r > g && r > 1.0) {
        // red is too big
        g = g / r;
        b = b / r;
        r = 1.0;
    } else if (g > b && g > r && g > 1.0) {
        // green is too big
        r = r / g;
        b = b / g;
        g = 1.0;
    } else if (b > r && b > g && b > 1.0) {
        // blue is too big
        r = r / b;
        g = g / b;
        b = 1.0;
    }
    

    
    //  Gamma correction
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;



    
    if (r > b && r > g) {
        // red is biggest
        if (r > 1.0) {
            g = g / r;
            b = b / r;
            r = 1.0;
        }
    }
    else if (g > b && g > r) {
        // green is biggest
        if (g > 1.0) {
            r = r / g;
            b = b / g;
            g = 1.0;
        }
    }
    else if (b > r && b > g) {
        // blue is biggest
        if (b > 1.0) {
            r = r / b;
            g = g / b;
            b = 1.0;
        }
    }
    

    return {
        a: Y,
        r: r * 255,
        g: g * 255,
        b: b * 255
    };
}

export function RGBtoXY(red: number, green: number, blue: number, gamut?: Gamut, model?: string): XYBright {

    
        red = red / 255;
        green = green / 255;
        blue = blue / 255;

        //Gamma correction
        red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
        green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
        blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

        const X = red * 0.4124 + green * 0.3576 + blue * 0.1805;
        const Y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const Z = red * 0.0193 + green * 0.1192 + blue * 0.9505;

        const x = X / (X + Y + Z);
        const y = Y / (X + Y + Z);
        const brightness = Y;

        const xy = {x, y, brightness};

        
        const colorPoints = gamut || getColorPointsForModel(model);
        const inReachOfLamps = checkPointInLampsReach(xy, colorPoints);
        if (!inReachOfLamps) {
            const pAB: XY = getClosestPointToPoints(colorPoints.red, colorPoints.green, xy);
            const pAC: XY = getClosestPointToPoints(colorPoints.blue, colorPoints.red, xy);
            const pBC: XY = getClosestPointToPoints(colorPoints.green, colorPoints.blue, xy);
    
            const dAB: number = getDistanceBetweenTwoPoints(xy, pAB);
            const dAC: number = getDistanceBetweenTwoPoints(xy, pAC);
            const dBC: number = getDistanceBetweenTwoPoints(xy, pBC);
            let lowest = dAB;
            let closestPoint = pAB;
    
            if (dAC < lowest) {
                lowest = dAC;
                closestPoint = pAC;
            }
    
            if (dBC < lowest) {
                lowest = dBC;
                closestPoint = pBC;
            }
    
            xy.x = closestPoint.x;
            xy.y = closestPoint.y;
        }

        return xy;
}

function getColorPointsForModel(model?: string): Gamut {
    const hueBulbs = ["LCT001", "LCT002", "LCT003"];
    const livingcolors = [
        "LLC001",
        "LLC005",
        "LLC006",
        "LLC007",
        "LLC011",
        "LLC012",
        "LLC013",
        "LST001"
    ];

    if(model && hueBulbs.includes(model)){
        return {
            red: {
                x: 0.674,
                y: 0.322
            },
            green: {
                x: 0.408,
                y: 0.517
            },
            blue: {
                x: 0.168,
                y: 0.041
            }
        };
    }else if(model && livingcolors.includes(model)){
        return {
            red: {
                x: 0.703,
                y: 0.296
            },
            green: {
                x: 0.214,
                y: 0.709
            },
            blue: {
                x: 0.139,
                y: 0.081
            }
        };
    }else{
        return {
            red: {
                x: 1,
                y: 0
            },
            green: {
                x: 0,
                y: 1
            },
            blue: {
                x: 0,
                y: 0
            }
        };
    }
}



function checkPointInLampsReach(p: XY, colorPoints: Gamut): boolean {
    const v1: XY = { x: colorPoints.green.x - colorPoints.red.x, y: colorPoints.green.y - colorPoints.red.y};
    const v2: XY = { x: colorPoints.blue.x - colorPoints.red.x, y: colorPoints.blue.y - colorPoints.red.y};
    const q: XY = { x: p.x - colorPoints.red.x, y: p.y - colorPoints.red.y};

    const s: number = crossProduct(q, v2)/ crossProduct(v1, v2);
    const t: number = crossProduct(v1, q)/ crossProduct(v1, v2);

    if ( (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0)) {
        return true;
    }

    return false;
}

function getClosestPointToPoints(A: XY, B: XY, P: XY): XY {
    const AP: XY = { x: P.x - A.x, y: P.y - A.y};
    const AB: XY = { x: B.x - A.x,  y: B.y - A.y};
    const ab2 = AB.x * AB.x + AB.y * AB.y;
    const ap_ab = AP.x * AB.x + AP.y * AB.y;

    let t = ap_ab / ab2;

    if (t < 0.0) {
        t = 0.0;
    }
    else if (t > 1.0) {
        t = 1.0;
    }

    const newPoint: XY = {x: A.x + AB.x * t, y: A.y + AB.y * t};
    return newPoint;
}

function getDistanceBetweenTwoPoints(p1: XY, p2: XY): number {
    const dx = p1.x - p2.x; // horizontal difference
    const dy = p1.y - p2.y; // vertical difference
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist;
}

function crossProduct(p1: XY, p2: XY): number {
    return (p1.x * p2.y - p1.y * p2.x);
}

