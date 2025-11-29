import color from "@/themes/app.colors";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const starStyle = { marginHorizontal: 1 }; // ⭐ spacing between stars

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome
          key={`full-${i}`}
          name="star"
          size={14}
          color="#FFD700"
          style={starStyle}
        />
      ))}

      {halfStar && (
        <FontAwesome
          name="star-half-full"
          size={14}
          color="#FFD700"
          style={starStyle}
        />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={14}
          color="#FFD700"
          style={starStyle}
        />
      ))}
    </View>
  );
};
