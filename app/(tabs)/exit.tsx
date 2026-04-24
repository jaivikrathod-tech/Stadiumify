import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_GATES } from '../../services/mockData';
import { DoorOpen, ShieldAlert, CheckCircle, Navigation } from 'lucide-react-native';

export default function ExitScreen() {
  const { user } = useAuth();
  const [matchEnded, setMatchEnded] = useState(false);
  const [userGate, setUserGate] = useState<typeof MOCK_GATES[0] | null>(null);

  useEffect(() => {
    if (user) {
      const gate = MOCK_GATES.find(g => g.recommended_sections.includes(user.section_id));
      if (gate) {
        setUserGate(gate);
      }
    }
  }, [user]);

  const simulateMatchEnd = () => {
    setMatchEnded(true);
    
    // Tiered Notification Logic Mock
    if (userGate) {
      if (userGate.congestion_level < 3) {
        Alert.alert(
          'Phase 1 Exit',
          `${userGate.gate_name} is currently clear. Safe travels! You can begin exiting now.`,
          [{ text: 'Got it' }]
        );
      } else {
        Alert.alert(
          'Phase 2 Exit',
          `${userGate.gate_name} is busy. Please remain in your seat. Enjoy a 10-minute post-match highlight reel while the crowd clears.`,
          [{ text: 'Watch Highlights' }, { text: 'Dismiss', style: 'cancel' }]
        );
      }
    }
  };

  const getGateStatusColor = (level: number) => {
    if (level <= 2) return 'bg-accent text-primary'; // Green
    if (level <= 4) return 'bg-yellow-500 text-white'; // Yellow
    return 'bg-red-500 text-white'; // Red
  };

  const getGateStatusText = (level: number) => {
    if (level <= 2) return 'Clear';
    if (level <= 4) return 'Moderate';
    return 'Heavy';
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 bg-gray-900 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Gate Analyzer</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {!matchEnded ? (
          <View className="bg-gray-800 rounded-2xl p-6 items-center justify-center mb-6 border border-gray-700">
            <ShieldAlert size={48} color="#CCFF00" className="mb-4" />
            <Text className="text-white text-xl font-bold mb-2">Match in Progress</Text>
            <Text className="text-gray-400 text-center mb-6">
              Exit flow analysis will begin automatically when the match concludes.
            </Text>
            <TouchableOpacity 
              className="bg-gray-700 px-6 py-3 rounded-full border border-gray-600"
              onPress={simulateMatchEnd}
            >
              <Text className="text-white font-bold">Simulate Match End</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-accent/20 border border-accent rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <CheckCircle size={24} color="#CCFF00" />
              <Text className="text-white text-xl font-bold ml-2">Match Ended</Text>
            </View>
            <Text className="text-white text-lg mb-2">
              Recommended Exit: <Text className="font-bold text-accent">{userGate?.gate_name}</Text>
            </Text>
            <Text className="text-gray-300">
              Based on your seat in Section {user?.section_id}, please head towards the {userGate?.location_description}.
            </Text>
          </View>
        )}

        <Text className="text-white font-bold mb-4 text-lg">Live Gate Status</Text>
        
        {MOCK_GATES.map(gate => (
          <View key={gate.id} className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-gray-700 p-3 rounded-full mr-4">
                <DoorOpen size={24} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">{gate.gate_name}</Text>
                <Text className="text-gray-400 text-xs">{gate.location_description}</Text>
              </View>
            </View>
            
            <View className={`px-3 py-1 rounded-full ${getGateStatusColor(gate.congestion_level)}`}>
              <Text className="font-bold text-sm">
                {getGateStatusText(gate.congestion_level)}
              </Text>
            </View>
          </View>
        ))}

        {userGate && userGate.congestion_level > 2 && matchEnded && (
          <View className="bg-gray-800 rounded-xl p-4 mt-2 border border-gray-700">
            <Text className="text-white font-bold mb-2">Alternative Route Suggested</Text>
            <Text className="text-gray-400 text-sm mb-4">
              Your primary gate is currently congested. Using an alternative gate might save you 15 minutes.
            </Text>
            <TouchableOpacity className="flex-row items-center justify-center bg-gray-700 p-3 rounded-lg">
              <Navigation size={16} color="white" />
              <Text className="text-white font-bold ml-2">View Alternative Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
