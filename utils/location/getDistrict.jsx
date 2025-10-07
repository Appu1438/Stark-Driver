import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDistrict = async (latitude, longitude, setDistrict) => {
    // console.log('get district')
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // console.log(data)

    if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        // console.log(addressComponents)
        const districtComp = addressComponents.find(comp =>
            comp.types.includes("administrative_area_level_3")
        );
        console.log(districtComp.long_name)
        setDistrict(districtComp.long_name)
        await AsyncStorage.setItem("currentDistrict", districtComp.long_name);
    }

    return null;
};
