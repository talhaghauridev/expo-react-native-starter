import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Text } from './ui/text';

interface ErrorComponentProps {
  onRetry: () => void;
  error: any;
}

const { width } = Dimensions.get('window');

const ErrorComponent: React.FC<ErrorComponentProps> = ({ onRetry, error }) => {
  const [showDetails, setShowDetails] = useState(false);
  const bounceAnim = useMemo(() => new Animated.Value(0), []);

  console.log(error.cause);
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [bounceAnim]);

  const bouncingStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20],
          }),
        },
      ],
    }),
    [bounceAnim]
  );

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <ScrollView className="flex-1 bg-[#F8F9FA] p-5">
      <View className="flex-grow items-center justify-center">
        <Animated.View
          className="items-center"
          style={bouncingStyle}>
          <Feather
            name="alert-octagon"
            size={84}
            color="#FF6B6B"
          />
        </Animated.View>

        <Text className="mb-2.5 mt-5 text-center text-2xl font-bold text-[#343A40]">
          Oops! Something went wrong
        </Text>

        <Text className="font-inter-medium mb-8 max-w-[80%] text-center text-base text-[#6C757D]">
          We're sorry, but it seems like there was an unexpected error. Our team has been notified
          and is working on it.
        </Text>

        <Button
          onPress={handleRetry}
          className="mb-4 max-w-[150px] rounded-lg">
          <Text>Try Again</Text>
        </Button>

        <TouchableOpacity
          onPress={toggleDetails}
          className="mb-2.5 rounded bg-[#007BFF] px-4 py-2.5">
          <Text className="text-sm font-bold text-white">
            {showDetails ? 'Hide Error Details' : 'Show Error Details'}
          </Text>
        </TouchableOpacity>

        {showDetails && error && (
          <View className="mt-2.5 w-full rounded-lg bg-[#F1F3F5] p-4">
            <View className="mb-2.5">
              <Text className="mb-0.5 text-sm font-bold text-[#495057]">Name:</Text>
              <Text className="text-xs text-[#6C757D]">{error.name}</Text>
            </View>

            <View className="mb-2.5">
              <Text className="mb-0.5 text-sm font-bold text-[#495057]">Message:</Text>
              <Text className="text-xs text-[#6C757D]">{error.message}</Text>
            </View>

            {error.cause && (
              <View className="mb-2.5">
                <Text className="mb-0.5 text-sm font-bold text-[#495057]">Cause:</Text>
                <Text className="text-xs text-[#6C757D]">{String(error.cause)}</Text>
              </View>
            )}

            <View className="mb-2.5">
              <Text className="mb-0.5 text-sm font-bold text-[#495057]">Stack Trace:</Text>
              <Text className="text-xs text-[#6C757D]">{error.stack}</Text>
            </View>

            <View className="mb-2.5">
              <Text className="mb-0.5 text-sm font-bold text-[#495057]">Time:</Text>
              <Text className="text-xs text-[#6C757D]">{new Date().toLocaleString()}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default memo(ErrorComponent);
