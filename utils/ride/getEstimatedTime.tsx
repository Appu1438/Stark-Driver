import { getDistance } from "geolib";

const getEstimateTime = (driver: any, userLocation: any) => {
    const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: driver.latitude, longitude: driver.longitude }
    );

    const averageSpeed = 500; // meters per minute (~30 km/h)
    const totalMinutes = distance / averageSpeed;

    let hours = Math.floor(totalMinutes / 60);
    let minutes = Math.round(totalMinutes % 60);

    // Ensure minimum 1 minute display
    if (hours === 0 && minutes === 0) {
        minutes = 1;
    }

    // Build readable string
    let formattedTime = "";
    if (hours > 0) formattedTime += `${hours}h `;
    formattedTime += `${minutes} min`;

    return formattedTime.trim();
};

export default getEstimateTime;
