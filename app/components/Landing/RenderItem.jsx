import { View, Text, useWindowDimensions, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next"; // Import the hook
import { OnboardingData } from "../../../assets/data/data";

const RenderItem = ({ item }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const { t } = useTranslation(); // Use the translation hook

  return (
    <View style={[
      styles.itemContainer, {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: item.backgroundColor,
      },
    ]}>
      <Image source={item.image} />
      <Text style={[styles.itemText, { color: item.textColor }]}>
        {t(item.text)} {/* Use translation key */}
      </Text>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 130,
  },
  itemText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 44,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});
