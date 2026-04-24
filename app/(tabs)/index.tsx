import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_STALLS } from '../../services/mockData';
import { MapPin, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Dynamically importing MapView as it causes issues on web without react-native-web-maps
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [stalls, setStalls] = useState(MOCK_STALLS);

  // Stadium center coordinates
  const stadiumRegion = {
    latitude: 37.7750,
    longitude: -122.4194,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const getMarkerColor = (load: number) => {
    if (load < 10) return '#CCFF00'; // Green
    if (load < 50) return '#FFCC00'; // Yellow
    return '#FF3B30'; // Red
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 bg-gray-900 border-b border-gray-800 flex-row justify-between items-center z-10">
        <View>
          <Text className="text-gray-400 text-xs uppercase tracking-wider">Welcome Back</Text>
          <Text className="text-white text-lg font-bold">{user?.user_name}</Text>
        </View>
        <View className="bg-gray-800 p-2 rounded-lg items-end">
          <Text className="text-gray-400 text-xs">Section {user?.section_id}</Text>
          <Text className="text-accent font-bold">Seat {user?.row_id}-{user?.seat_number}</Text>
        </View>
      </View>

      <View className="flex-1 relative">
        {Platform.OS !== 'web' && MapView ? (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={stadiumRegion}
            userInterfaceStyle="dark"
            customMapStyle={mapStyle} // Using dark map style
          >
            {user?.current_location && (
              <Marker coordinate={user.current_location}>
                <View className="bg-blue-500 p-2 rounded-full border-2 border-white">
                  <Users size={16} color="white" />
                </View>
              </Marker>
            )}
            
            {stalls.map((stall) => (
              <Marker
                key={stall.id}
                coordinate={stall.coordinates}
                title={stall.name}
                description={`${stall.cuisine_type} - Wait: ${stall.current_load} mins`}
              >
                <View className="items-center">
                  <View 
                    className="p-2 rounded-full mb-1"
                    style={{ backgroundColor: getMarkerColor(stall.current_load) }}
                  >
                    <MapPin size={20} color="#121212" />
                  </View>
                  <View className="bg-gray-900/80 px-2 py-1 rounded">
                    <Text className="text-white text-xs font-bold">{stall.name}</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-800">
            <Text className="text-white">Map View not supported on Web</Text>
          </View>
        )}
      </View>

      <View className="absolute bottom-4 left-4 right-4 bg-gray-900/90 p-4 rounded-2xl border border-gray-700 shadow-lg">
        <Text className="text-white font-bold mb-3">Nearby Stalls (Queue Status)</Text>
        {stalls.sort((a, b) => a.current_load - b.current_load).map(stall => (
          <View key={stall.id} className="flex-row justify-between items-center mb-2 last:mb-0">
            <View>
              <Text className="text-white">{stall.name}</Text>
              <Text className="text-gray-400 text-xs">{stall.cuisine_type}</Text>
            </View>
            <View className="flex-row items-center">
              <View 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: getMarkerColor(stall.current_load) }} 
              />
              <Text className="text-gray-300 text-sm">{stall.current_load}m wait</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];
