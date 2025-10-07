import * as Device from "expo-device";
import * as Crypto from "expo-crypto";

export const getDeviceInfo = async () => {
  const rawString = `${Device.brand}-${Device.modelName}-${Device.osName}-${Device.osBuildId}`;
  const fingerprint = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawString
  );

  return {
    fingerprint,
    brand: Device.brand,
    model: Device.modelName,
    // modelId: Device.modelId,
    osName: Device.osName,
    // osVersion: Device.osVersion,
    osBuildId: Device.osBuildId,
  };
};
