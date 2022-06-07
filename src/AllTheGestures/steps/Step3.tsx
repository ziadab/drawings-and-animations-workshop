import React, { ReactNode } from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  createIdentityMatrix,
  rotateZ,
  scale3d,
  translate3d,
} from '../components/matrixMath';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Movable({ children }: { children: ReactNode }) {
  const matrix = useSharedValue(createIdentityMatrix());
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ matrix: matrix.value }],
    };
  });

  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = translate3d(matrix.value, e.changeX, e.changeY, 0);
  });

  const rotate = Gesture.Rotation().onChange((e) => {
    matrix.value = rotateZ(matrix.value, e.rotationChange, 0, 0, 0);
  });

  const scale = Gesture.Pinch().onChange((e) => {
    matrix.value = scale3d(
      matrix.value,
      e.scaleChange,
      e.scaleChange,
      1,
      0,
      0,
      0
    );
  });

  return (
    <GestureDetector gesture={Gesture.Simultaneous(rotate, scale, pan)}>
      <Animated.View>
        <Animated.View style={[{ position: 'absolute' }, styles]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export function AllTheGestures() {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Movable>
        <AnimatedIcon name="favorite" color="#ffaaa8" size={150} />
      </Movable>
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: '100%',
          alignItems: 'center',
        }}></View>
    </View>
  );
}
