import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  timestamp: number;
}

export default function Index() {
  const [isTracking, setIsTracking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la ubicación para usar esta app');
        return;
      }
    })();
  }, []);

  const startTracking = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    setShowModal(false);
    setIsTracking(true);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
        timestamp: location.timestamp,
      };

      setCurrentLocation(locationData);
      setLastUpdateTime(new Date());

      // Continuar actualizando la ubicación cada 5 segundos
      const interval = setInterval(async () => {
        try {
          const newLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const newLocationData: LocationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            speed: newLocation.coords.speed,
            timestamp: newLocation.timestamp,
          };

          setCurrentLocation(newLocationData);
          setLastUpdateTime(new Date());
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }, 5000);

      // Limpiar el intervalo cuando se detenga el tracking
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setCurrentLocation(null);
    setLastUpdateTime(null);
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="menu" size={24} color="#333" />
        <View style={styles.headerCenter}>
          <MaterialIcons name="gps-fixed" size={20} color="#333" />
          <Text style={styles.headerTitle}>GPS Tracker</Text>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="layers" size={24} color="#333" style={styles.headerIcon} />
          <MaterialIcons name="settings" size={24} color="#333" />
        </View>
      </View>

      <View style={styles.content}>
        {!isTracking ? (
          // Estado inicial - Detenido
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
        ) : (
          // Estado rastreando
          <View style={styles.trackingContent}>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#999" />
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicator}>
                  <View style={styles.greenDot} />
                  <Text style={styles.statusText}>Rastreando</Text>
                </View>
                <View style={styles.activeLabel}>
                  <Text style={styles.activeLabelText}>ACTIVO</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
                <MaterialIcons name="navigation" size={16} color="white" />
                <Text style={styles.stopButtonText}>Detener</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.locationInfoContainer}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={20} color="#333" />
                <Text style={styles.locationTitle}>Ubicación Actual</Text>
              </View>

              {currentLocation && (
                <View style={styles.locationDetails}>
                  <Text style={styles.locationLabel}>Coordenadas</Text>
                  <Text style={styles.locationValue}>
                    {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
                  </Text>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.locationLabel}>Precisión</Text>
                      <Text style={styles.locationValue}>
                        {currentLocation.accuracy ? `${Math.round(currentLocation.accuracy)}m` : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.locationLabel}>Velocidad</Text>
                      <Text style={styles.locationValue}>
                        {currentLocation.speed ? `${Math.round(currentLocation.speed * 3.6)} km/h` : '0 km/h'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timeContainer}>
                    <MaterialIcons name="access-time" size={16} color="#666" />
                    <Text style={styles.timeText}>
                      Última actualización
                    </Text>
                  </View>
                  <Text style={styles.timeValue}>
                    {lastUpdateTime ? formatTime(lastUpdateTime) : '--:--:--'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bottom section - siempre visible cuando no está rastreando */}
        {!isTracking && (
          <View style={styles.bottomSection}>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={styles.grayDot} />
                <Text style={styles.statusText}>Detenido</Text>
              </View>
              <View style={styles.inactiveLabel}>
                <Text style={styles.inactiveLabelText}>INACTIVO</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.startButton} 
              onPress={() => setShowModal(true)}
            >
              <MaterialIcons name="navigation" size={16} color="white" />
              <Text style={styles.startButtonText}>Iniciar</Text>
            </TouchableOpacity>

            <View style={styles.currentLocationContainer}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={20} color="#333" />
                <Text style={styles.locationTitle}>Ubicación Actual</Text>
              </View>

              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Coordenadas</Text>
                <Text style={styles.locationValue}>-13.540975, -71.984268</Text>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.locationLabel}>Precisión</Text>
                    <Text style={styles.locationValue}>43m</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.locationLabel}>Velocidad</Text>
                    <Text style={styles.locationValue}>0 km/h</Text>
                  </View>
                </View>

                <View style={styles.timeContainer}>
                  <MaterialIcons name="access-time" size={16} color="#666" />
                  <Text style={styles.timeText}>Última actualización</Text>
                </View>
                <Text style={styles.timeValue}>23:50:54</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Modal para ingresar nombre */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <MaterialIcons name="gps-fixed" size={32} color="#007AFF" />
              <Text style={styles.modalTitle}>Iniciar Rastreo GPS</Text>
              <Text style={styles.modalSubtitle}>Seguimiento por satélite</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre del usuario a rastrear</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ingresa el nombre..."
                placeholderTextColor="#999"
                value={userName}
                onChangeText={setUserName}
                autoFocus
              />
            </View>

            <View style={styles.featureContainer}>
              <MaterialIcons name="gps-fixed" size={20} color="#007AFF" />
              <Text style={styles.featureTitle}>Rastreo mediante GPS</Text>
              <Text style={styles.featureDescription}>
                El seguimiento utilizará señales de satélite para obtener la ubicación precisa en tiempo real.
              </Text>
            </View>

            <TouchableOpacity style={styles.startTrackingButton} onPress={startTracking}>
              <Text style={styles.startTrackingButtonText}>Iniciar Rastreo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F8F8F8',
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
  headerIcon: {
    marginRight: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
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
  trackingContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  grayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activeLabel: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeLabelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveLabel: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveLabelText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  currentLocationContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  locationInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationDetails: {
    gap: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  featureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  startTrackingButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  startTrackingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
