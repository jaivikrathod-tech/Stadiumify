import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_STALLS } from '../../services/mockData';
import { Clock, Navigation, Plus, Minus, CreditCard } from 'lucide-react-native';

export default function FoodScreen() {
  const [selectedStall, setSelectedStall] = useState(MOCK_STALLS[0]);
  const [cart, setCart] = useState<{item: string, price: number, qty: number}[]>([]);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'pending' | 'ready'>('idle');

  const menuItems = [
    { id: 1, name: 'Stadium Burger', price: 12.99 },
    { id: 2, name: 'Classic Hot Dog', price: 8.50 },
    { id: 3, name: 'Loaded Nachos', price: 10.00 },
    { id: 4, name: 'Large Soda', price: 5.50 },
  ];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item === item.name);
      if (existing) {
        return prev.map(i => i.item === item.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item === itemName);
      if (existing && existing.qty > 1) {
        return prev.map(i => i.item === itemName ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter(i => i.item !== itemName);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    setOrderStatus('pending');
    Alert.alert('Order Placed', 'Your order has been sent to the kitchen.', [
      { text: 'OK' }
    ]);
    
    // Simulate order ready after 5 seconds
    setTimeout(() => {
      setOrderStatus('ready');
      Alert.alert('ORDER READY!', `Your food from ${selectedStall.name} is ready for pickup!`, [
        { text: 'Collect Now', onPress: () => {
          setOrderStatus('idle');
          setCart([]);
        }}
      ]);
    }, 5000);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 bg-gray-900 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Smart Food Ordering</Text>
      </View>

      <View className="p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {MOCK_STALLS.map(stall => (
            <TouchableOpacity 
              key={stall.id}
              className={`mr-3 px-4 py-3 rounded-xl border ${selectedStall.id === stall.id ? 'bg-accent/20 border-accent' : 'bg-gray-800 border-gray-700'}`}
              onPress={() => setSelectedStall(stall)}
            >
              <Text className={selectedStall.id === stall.id ? 'text-accent font-bold' : 'text-white'}>{stall.name}</Text>
              <View className="flex-row items-center mt-1">
                <Clock size={12} color="#888" />
                <Text className="text-gray-400 text-xs ml-1">{stall.current_load}m wait</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedStall.current_load > 50 && (
          <View className="bg-orange-500/20 border border-orange-500 p-3 rounded-xl mb-4 flex-row items-center">
            <Navigation size={20} color="#f97316" />
            <View className="ml-3 flex-1">
              <Text className="text-orange-500 font-bold">High Wait Time!</Text>
              <Text className="text-orange-400 text-xs">Get 5% off if you order from Burger Boss instead.</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-white font-bold mb-3 text-lg">Menu ({selectedStall.cuisine_type})</Text>
        {menuItems.map(item => (
          <View key={item.id} className="bg-gray-800 p-4 rounded-xl mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold">{item.name}</Text>
              <Text className="text-accent">${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              className="bg-accent p-2 rounded-full"
              onPress={() => addToCart(item)}
            >
              <Plus size={20} color="#121212" />
            </TouchableOpacity>
          </View>
        ))}
        <View className="h-20" />
      </ScrollView>

      {cart.length > 0 && orderStatus === 'idle' && (
        <View className="absolute bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-800">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">Your Order</Text>
            <Text className="text-accent font-bold text-lg">${total.toFixed(2)}</Text>
          </View>
          
          <ScrollView className="max-h-32 mb-4">
            {cart.map((c, i) => (
              <View key={i} className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-300 flex-1">{c.item}</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => removeFromCart(c.item)} className="p-1 bg-gray-700 rounded">
                    <Minus size={14} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white mx-3">{c.qty}</Text>
                  <TouchableOpacity onPress={() => addToCart({name: c.item, price: c.price})} className="p-1 bg-gray-700 rounded">
                    <Plus size={14} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity 
            className="bg-accent rounded-xl p-4 flex-row justify-center items-center"
            onPress={placeOrder}
          >
            <CreditCard size={20} color="#121212" />
            <Text className="text-primary font-bold text-lg ml-2">Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderStatus === 'pending' && (
        <View className="absolute bottom-0 left-0 right-0 bg-gray-900 p-6 border-t border-gray-800 items-center justify-center h-48">
          <Clock size={40} color="#CCFF00" className="mb-4" />
          <Text className="text-white font-bold text-lg mb-1">Order Preparing</Text>
          <Text className="text-gray-400 text-center text-sm">We'll notify you when it's ready to pick up.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
