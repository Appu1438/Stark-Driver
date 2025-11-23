import * as Speech from "expo-speech";

export const playVoiceAlertTTS = (text = "New ride request received") => {
  try {
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 1.0,
      onError: (e) => console.log("TTS Error:", e),
    });
  } catch (err) {
    console.log("Speech error:", err);
  }
};
