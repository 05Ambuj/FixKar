import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
  SafeAreaView,
} from "react-native";
import data from "../../../assets/data/data";
import { router,Redirect } from "expo-router";
import RenderItem from "./RenderItem";
import CustomButton from "./CustomButton";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Pagination from "./Pagination";
import {
  Canvas,
  Circle,
  Group,
  SkImage,
  makeImageFromView,
    Mask,
  Image
} from "@shopify/react-native-skia";


export default Landing = () => {
  const pd = PixelRatio.get();
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [Active, setActive] = useState(false);
  const [overlay, setOverlay] = useState(null);

  const ref = useRef(null);
  const buttonVal = useSharedValue(0);

  const mask = useSharedValue(0);
  const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlerPress = async () => {
    if (currentIndex === data.length - 1 && !Active) {
      router.replace('/SignUp')
    }
    if (!Active) {
      setActive(true);
      const snapshot = await makeImageFromView(ref);
      setOverlay(snapshot);
      await wait(60);
      setCurrentIndex((prev) => prev + 1);
      mask.value = withTiming(SCREEN_HEIGHT, { duration: 1000 });
      buttonVal.value = withTiming(buttonVal.value + SCREEN_HEIGHT);
      await wait(1000);
      setOverlay(null);
      mask.value = 0;
      setActive(false);
    }
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <View ref={ref} collapsable={false}>
        {data.map((item, index) => {
          return (
            currentIndex === index && <RenderItem item={item} key={index} />
          );
        })}
      </View>
      {overlay && (
        <Canvas style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Mask
            mode="luminance"
            mask={
              <Group>
                <Circle
                  cx={SCREEN_WIDTH / 2}
                  cy={SCREEN_HEIGHT - 160}
                  r={SCREEN_HEIGHT}
                  color="white"
                />
                <Circle
                  cx={SCREEN_WIDTH / 2}
                  cy={SCREEN_HEIGHT - 160}
                  r={mask}
                  color="black"
                />
              </Group>
            }
          >
            <Image
              image={overlay}
              x={0}
              y={0}
              width={overlay.width() / pd}
              height={overlay.height() / pd}
            />
          </Mask>
        </Canvas>
      )}

      <CustomButton handlerPress={handlerPress} buttonVal={buttonVal} />
      <Pagination data={data} buttonVal={buttonVal} />
      </SafeAreaView>
      
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});