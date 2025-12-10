export const uploadToCloudinary = async (photo) => {
  // console.log(photo);

  const cloudName = "starkcab";
  const uploadPreset = "starkcab"; // <--- FIXED

  const cloudinaryUploadEndpoint =
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`; // <--- FIXED

  try {
    const response = await fetch(cloudinaryUploadEndpoint, {
      method: "POST",
      body: JSON.stringify({
        file: `data:image/jpeg;base64,${photo}`,
        upload_preset: uploadPreset,
        folder: "drivers_profile",  // optional
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("data", data);

    return data.secure_url; // <--- IMAGE URL
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    return null;
  }
};
