import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialIcons name="gps-fixed" size={20} color="#333" />
          <Text style={styles.headerTitle}>GPS Tracker</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <MaterialIcons name="layers" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <MaterialIcons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.centerContent}>
          <View style={styles.mapContainer}>
            <MaterialIcons name="location-on" size={60} color="#333" />
          </View>
          
          <Text style={styles.mapTitle}>Mapa Interactivo</Text>
          <Text style={styles.mapSubtitle}>
            Tu ubicación se mostrará aquí en tiempo real
          </Text>

          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinates}>-13.5410, -71.9843</Text>
          </View>

          <TouchableOpacity style={styles.directionButton}>
            <MaterialIcons name="navigation" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.locationButton}>
            <MaterialIcons name="my-location" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  mapContainer: {
    width: 320,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  coordinatesContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coordinates: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  directionButton: {
    position: 'absolute',
    right: 30,
    bottom: 220,
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  locationButton: {
    position: 'absolute',
    right: 30,
    bottom: 160,
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
