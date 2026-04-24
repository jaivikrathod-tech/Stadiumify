import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Camera, RefreshCw } from 'lucide-react-native';

const VIDEO_SOURCES = [
  { id: 'cam1', name: 'Main Broadcast', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8' }, // Mock HLS
  { id: 'cam2', name: 'Player Cam 1', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8' },
  { id: 'cam3', name: 'Goal Cam', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8' },
  { id: 'cam4', name: 'Tactical Cam', url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8' },
];

export default function LiveScreen() {
  const [activeCam, setActiveCam] = useState(VIDEO_SOURCES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  const switchCamera = (cam: typeof VIDEO_SOURCES[0]) => {
    setActiveCam(cam);
    // In a real app, you'd sync the new stream to the same timestamp as the old one
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 bg-gray-900 border-b border-gray-800 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Live View</Text>
        <View className="bg-red-500/20 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
          <Text className="text-red-500 font-bold text-xs">LIVE</Text>
        </View>
      </View>

      <View className="w-full bg-black relative" style={{ height: Dimensions.get('window').width * (9/16) }}>
        <Video
          ref={videoRef}
          source={{ uri: activeCam.url }}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          isLooping
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>

      <View className="p-4">
        <Text className="text-white font-bold mb-3 text-lg flex-row items-center">
          <Camera size={20} color="white" />
          {' '}Multi-Angle Camera Selection
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {VIDEO_SOURCES.map((cam) => (
            <TouchableOpacity 
              key={cam.id}
              className={`mr-3 w-32 h-24 rounded-xl border-2 justify-end p-2 ${activeCam.id === cam.id ? 'border-accent' : 'border-gray-700 bg-gray-800'}`}
              onPress={() => switchCamera(cam)}
              style={{ overflow: 'hidden' }}
            >
              {activeCam.id === cam.id && (
                <View className="absolute top-2 right-2 bg-accent p-1 rounded-full z-10">
                  <Text className="text-primary text-[10px] font-bold">ACTIVE</Text>
                </View>
              )}
              <Text className={activeCam.id === cam.id ? 'text-accent font-bold' : 'text-white font-semibold'}>{cam.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="px-4 flex-1">
        <View className="bg-gray-800 rounded-xl p-4 mt-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-bold">Match Scoreboard</Text>
            <RefreshCw size={16} color="#888" />
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <View className="items-center">
              <View className="w-16 h-16 bg-blue-600 rounded-full justify-center items-center mb-2">
                <Text className="text-white font-bold text-xl">HOME</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="text-white text-4xl font-bold tracking-widest">2 - 1</Text>
              <Text className="text-accent text-sm mt-1">75:42</Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 bg-red-600 rounded-full justify-center items-center mb-2">
                <Text className="text-white font-bold text-xl">AWAY</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
