import React from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Button from "../common/button";
import color from "@/themes/app.colors";
import { Gps, Location } from "@/utils/icons";
import { windowHeight, windowWidth } from "@/themes/app.constant";

const RideModal = ({
  visible,
  onClose,
  title = "🚘 New Ride Request!",
  countdown,
  timeoutMessage,
  region,
  firstMarker,
  secondMarker,
  currentLocationName,
  destinationLocationName,
  distance,
  fare,
  onAccept,
  onReject,
  showMap = true,
  showButtons = true,
}) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            width: "100%",
            padding: 16,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontFamily: "TT-Octosquares-Medium",
              fontSize: windowHeight(18),
              marginBottom: 12,
              textAlign: "center",
              color: "#222",
            }}
          >
            {title}
          </Text>

          {/* Countdown & Timeout */}
          {timeoutMessage ? (
            <Text
              style={{
                textAlign: "center",
                color: timeoutMessage.includes("expired") ? "red" : "#f59e0b",
                marginBottom: 4,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              {timeoutMessage}
            </Text>
          ) : null}

          {countdown > 0 && (
            <Text
              style={{
                textAlign: "center",
                color: "#f59e0b",
                marginBottom: 10,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              ⏱ Time left: {countdown}s
            </Text>
          )}

          {/* Map */}
          {showMap && (
            <MapView
              style={{
                height: windowHeight(180),
                borderRadius: 12,
                overflow: "hidden",
              }}
              region={region}
            >
              {firstMarker && <Marker coordinate={firstMarker} />}
              {secondMarker && <Marker coordinate={secondMarker} />}
              {firstMarker && secondMarker && (
                <MapViewDirections
                  origin={firstMarker}
                  destination={secondMarker}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                  strokeWidth={4}
                  strokeColor="#3b82f6"
                />
              )}
            </MapView>
          )}

          {/* Locations */}
          {currentLocationName && destinationLocationName && (
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <View style={{ alignItems: "center", marginRight: 12 }}>
                <Location color={"#000"} />
                <View
                  style={{
                    height: 30,
                    borderLeftWidth: 2,
                    borderColor: color.buttonBg,
                    marginVertical: 4,
                  }}
                />
                <Gps colors={"#000"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 14,
                    marginBottom: 4,
                    color: "#444",
                  }}
                >
                  {currentLocationName}
                </Text>
                <Text
                  style={{
                    height: 1,
                    backgroundColor: "#ccc",
                    marginVertical: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 14,
                    color: "#444",
                  }}
                >
                  {destinationLocationName}
                </Text>
              </View>
            </View>
          )}

          {/* Fare Info */}
          {fare && (
            <View style={{ marginTop: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "TT-Octosquares-Medium",
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                Distance: {distance} km
              </Text>
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "TT-Octosquares-Medium",
                    color: "#333",
                  }}
                >
                  Total Fare: ₹{fare?.totalFare}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "TT-Octosquares-Medium",
                    color: "#16a34a",
                  }}
                >
                  Driver Earnings (85%): ₹{fare?.driverEarnings}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "TT-Octosquares-Medium",
                    color: "#eab308",
                  }}
                >
                  Platform Share (15%): ₹{fare?.platformShare}
                </Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          {showButtons && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Button
                title="Decline"
                onPress={onReject}
                width={windowWidth(120)}
                height={windowHeight(36)}
                backgroundColor="crimson"
              />
              <Button
                title="Accept"
                onPress={onAccept}
                width={windowWidth(120)}
                height={windowHeight(36)}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default RideModal;
