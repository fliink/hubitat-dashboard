export interface HueResource {
    id: string,
    id_v1: string,
    owner: { rid: string, rtype: string },
    metadata: { name: string, archetype: string },
    on: { on: boolean },
    dimming: { brightness: number, min_dim_level: number },
    dimming_delta: any,
    color_temperature: { mirek: number, mirek_valid: boolean, mirek_schema: any },
    color_temperature_delta: any,
    color: { xy: any, gamut: any, gamut_type: string },
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
    alert: { action_values: [] },
    signaling: any,
    mode: string,
    effects: {
      status_values: [],
      status: string,
      effect_values: []
    },
    type: string
  }