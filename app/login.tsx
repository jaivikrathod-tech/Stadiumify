import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Ticket } from 'lucide-react-native';

export default function LoginScreen() {
  const [ticketId, setTicketId] = useState('');
  const [userName, setUserName] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!ticketId || !userName) {
      Alert.alert('Error', 'Please enter both Ticket ID and User Name.');
      return;
    }
    const success = await login(ticketId, userName);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid Ticket ID or User Name.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary justify-center items-center p-6"
    >
      <View className="items-center mb-10">
        <View className="bg-accent/20 p-4 rounded-full mb-4">
          <Ticket size={48} color="#CCFF00" />
        </View>
        <Text className="text-3xl font-bold text-white mb-2">Stadiumify</Text>
        <Text className="text-gray-400 text-center">Match-Day Companion</Text>
      </View>

      <View className="w-full space-y-4">
        <View>
          <Text className="text-gray-300 mb-1 ml-1">Ticket ID</Text>
          <TextInput
            className="w-full bg-gray-800 text-white rounded-xl p-4 min-h-[48px] border border-gray-700 focus:border-accent"
            placeholder="e.g. TKT-12345"
            placeholderTextColor="#666"
            value={ticketId}
            onChangeText={setTicketId}
            autoCapitalize="characters"
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-300 mb-1 ml-1">Full Name</Text>
          <TextInput
            className="w-full bg-gray-800 text-white rounded-xl p-4 min-h-[48px] border border-gray-700 focus:border-accent"
            placeholder="e.g. John Doe"
            placeholderTextColor="#666"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity 
          className="w-full bg-accent rounded-xl p-4 min-h-[48px] items-center mt-8"
          onPress={handleLogin}
        >
          <Text className="text-primary font-bold text-lg">Enter Stadium</Text>
        </TouchableOpacity>
        
        <View className="mt-6 p-4 bg-gray-800 rounded-lg">
          <Text className="text-gray-400 text-sm font-bold mb-2">Mock Credentials:</Text>
          <Text className="text-gray-500 text-xs">Ticket ID: TKT-12345</Text>
          <Text className="text-gray-500 text-xs">Name: John Doe</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
