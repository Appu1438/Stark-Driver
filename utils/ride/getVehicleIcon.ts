const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'Auto':
      return require('@/assets/images/vehicles/auto_live.png');
    case 'Sedan':
      return require('@/assets/images/vehicles/sedan_live.png');
    case 'Hatchback':
      return require('@/assets/images/vehicles/hatchback_live.png');
    case 'Suv':
      return require('@/assets/images/vehicles/suv_live.png');
    default:
      return require('@/assets/images/vehicles/sedan_live.png');
  }
};

export default getVehicleIcon