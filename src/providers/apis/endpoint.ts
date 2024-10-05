export const ENDPOINTS = {
  getAllMakesXML: `/getallmakes?format=XML`,
  getMakeByIdXML: (makeId: string) =>
    `/GetVehicleTypesForMakeId/${makeId}?format=XML`,
};
