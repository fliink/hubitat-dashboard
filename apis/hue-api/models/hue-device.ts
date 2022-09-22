export interface HueDevice {
    type: string,
    id: string,
    id_v1: string,
    services: [{
      rid: string,
      rtype: string,

    }],
    product_data: {
      model_id: string,
      manufacturer_name: string,
      product_name: string,
      certified: boolean,
      software_version: string,
      hardware_platform_type: string
    },
    metadata: { name: string, archetype: string },
    owner: { rid: string, rtype: string }
  }