import { Gamut, XY } from "../../core/color/cie"

export interface HueLight {
    id: string,
    id_v1: string,
    owner: { rid: string, rtype: string },
    metadata: { name: string, archetype: string },
    on: { on: boolean },
    dimming: { brightness: number, min_dim_level?: number },
    dimming_delta: any,
    color_temperature: {
        mirek: number, 
        mirek_valid: boolean, 
        mirek_schema: {
            mirek_minimum: number,
            mirek_maximum: number
        }
    },
    color: {
        xy: XY, 
        gamut?: Gamut,
        gamut_type?: 'A' | 'B' | 'C'
    },
    color_temperature_delta: any,
    product_data: {
        model_id: string
    },
    services: [{
        rid: string,
        rtype: string
    }],
    dynamics: {
        status: string,
        status_values: string[],
        speed: number,
        speed_valid: boolean
    },
    gradient: {
        points: [{
            color: {
                xy: XY
            }
        }],
        points_capable: number
    }
    alert: { action_values: [] },
    signaling: any,
    mode: string,
    effects: {
        status_values: [],
        status: string,
        effect_values: []
    },
    timed_effects: {
        effect: string,
        duration: number,
        status_values: [],
        status: string,
        effect_values: []
    },
    type: string
}