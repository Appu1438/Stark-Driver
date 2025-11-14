import React from "react";
import { Modal, TouchableOpacity, View, Text, Image, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Button from "../common/button";
import color from "@/themes/app.colors";
import { Gps, Location } from "@/utils/icons";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { customMapStyle } from "@/utils/map/mapStyle";
import Images from "@/utils/images";

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

  const strokeColor = Platform.select({
    ios: color.primaryGray,   // light gray for iOS
    android: color.primaryGray, // same gray, but Android renders differently
  });

  const lineDash = Platform.select({
    ios: [0, 0],     // forces solid line on iOS
    android: undefined, // Android doesn't need it for solid
  });
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: color.subPrimary,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
        activeOpacity={1}
      >
        <View
          style={{
            backgroundColor: color.subPrimary,
            borderRadius: 20,
            width: "100%",
            padding: 20,
            elevation: 6,
            shadowColor: color.subPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            borderWidth: 2,
            borderColor: color.border
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontFamily: "TT-Octosquares-Medium",
              fontSize: windowHeight(20),
              marginBottom: 10,
              textAlign: "center",
              color: color.primaryText,
            }}
          >
            {title}
          </Text>

          {/* Countdown / Timeout */}
          {timeoutMessage ? (
            <Text
              style={{
                textAlign: "center",
                color: timeoutMessage.includes("expired")
                  ? color.primaryText
                  : color.primaryText,
                marginBottom: 6,
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
                color: color.primaryText,
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
                marginBottom: 16,
              }}
              region={region}
              provider={PROVIDER_GOOGLE}
              customMapStyle={customMapStyle}
            >
              {firstMarker &&
                <Marker
                  coordinate={firstMarker}
                >
                  <Image
                    source={Images.mapMarker}
                    style={{ width: windowWidth(35), height: windowHeight(35), tintColor: color.primaryGray }}
                    resizeMode="contain"
                  />
                </Marker>
              }
              {secondMarker &&
                <Marker
                  coordinate={secondMarker}
                >
                  <Image
                    source={Images.mapMarker}
                    style={{ width: windowWidth(35), height: windowHeight(35), tintColor: color.primaryGray }}
                    resizeMode="contain"
                  />
                </Marker>
              }
              {firstMarker && secondMarker && (
                <MapViewDirections
                  origin={firstMarker}
                  destination={secondMarker}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                  strokeWidth={4}
                  strokeColor={strokeColor}
                  lineCap="round"
                  lineJoin="round"
                  optimizeWaypoints
                  mode="DRIVING"
                  precision="high"
                  lineDashPattern={lineDash}
                />
              )}
            </MapView>
          )}

          {/* Locations */}
          {currentLocationName && destinationLocationName && (
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <View style={{ alignItems: "center", marginRight: 10 }}>
                <Location color={color.lightGray} />
                <View
                  style={{
                    height: 30,
                    borderLeftWidth: 2,
                    borderColor: color.lightGray,
                    marginVertical: 4,
                  }}
                />
                <Gps colors={color.lightGray} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 14,
                    marginBottom: 6,
                    color: color.primaryText,
                  }}
                >
                  {currentLocationName}
                </Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: color.border,
                    marginVertical: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 14,
                    color: color.primaryText,
                  }}
                >
                  {destinationLocationName}
                </Text>
              </View>
            </View>
          )}

          {/* Fare Info */}
          {fare && (
            <View
              style={{
                // backgroundColor: color.subPrimary,
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: color.border
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "TT-Octosquares-Medium",
                  color: color.primaryText,
                  marginBottom: 4,
                }}
              >
                Distance: {distance} km
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "TT-Octosquares-Medium",
                  color: color.primaryText,
                  marginBottom: 4,
                }}
              >
                Total Fare: ₹{fare?.totalFare}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "TT-Octosquares-Medium",
                  color: color.lightGray,
                  marginBottom: 2,
                }}
              >
                Driver Earnings (85%): ₹{fare?.driverEarnings}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "TT-Octosquares-Medium",
                  color: color.lightGreen,
                }}
              >
                Platform Share (15%): ₹{fare?.platformShare}
              </Text>
            </View>
          )}

          {/* Buttons */}
          {showButtons && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button
                title="Decline"
                onPress={onReject}
                width={windowWidth(120)}
                height={windowHeight(38)}
                backgroundColor={color.buttonBg}
                textColor={color.primary}
              />
              <Button
                title="Accept"
                onPress={onAccept}
                width={windowWidth(120)}
                height={windowHeight(38)}
                backgroundColor={color.buttonBg}
                textColor={color.primary}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default RideModal;
