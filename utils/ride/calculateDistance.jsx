export const calculateDistance = async (lat1, lon1, lat2, lon2) => {

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&mode=driving&key=${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
      const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
      console.log(distanceInKm)
      return distanceInKm;
    } else {
      throw new Error("Could not calculate driving distance");
    }
  };