import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
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

export default function IndexScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('0s');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la ubicación para usar esta app');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(`${elapsed}s`);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const startTracking = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    setShowModal(false);
    setIsTracking(true);
    const now = new Date();
    setStartTime(now);
    setLastUpdateTime(now);

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
    setStartTime(null);
    setElapsedTime('0s');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeWithSeconds = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
        </View>

        {!isTracking ? (
          // Estado inicial - Detenido
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Estado Detenido */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicator}>
                  <View style={styles.grayDot} />
                  <Text style={styles.statusText}>Detenido</Text>
                </View>
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>INACTIVO</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.startButton} 
                onPress={() => setShowModal(true)}
              >
                <MaterialIcons name="navigation" size={16} color="white" />
                <Text style={styles.startButtonText}>Iniciar</Text>
              </TouchableOpacity>
            </View>

            {/* Ubicación Actual */}
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={20} color="#333" />
                <Text style={styles.locationTitle}>Ubicación Actual</Text>
              </View>

              <View style={styles.locationDetails}>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Latitud:</Text>
                  <Text style={styles.locationValue}>-13.540991</Text>
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Longitud:</Text>
                  <Text style={styles.locationValue}>-71.984282</Text>
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Precisión:</Text>
                  <Text style={styles.locationValue}>37m</Text>
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Velocidad:</Text>
                  <Text style={styles.locationValue}>0 km/h</Text>
                </View>

                <View style={styles.timeSection}>
                  <View style={styles.timeLabelsRow}>
                    <Text style={styles.timeLabel}>Inicio</Text>
                    <Text style={styles.timeLabel}>Tiempo</Text>
                    <Text style={styles.timeLabel}>Última actualización</Text>
                  </View>
                  <View style={styles.timeValuesRow}>
                    <Text style={styles.timeValue}>10:57</Text>
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>50s</Text>
                    </View>
                    <Text style={styles.timeValue}>10:57</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          // Estado rastreando
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Geolocalización via GPS */}
            <View style={styles.gpsCard}>
              <View style={styles.gpsHeader}>
                <View style={styles.gpsIndicator}>
                  <MaterialIcons name="gps-fixed" size={16} color="#4CAF50" />
                  <Text style={styles.gpsText}>Geolocalización via GPS</Text>
                </View>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>EN VIVO</Text>
                </View>
              </View>
              
              <View style={styles.userInfo}>
                <View style={styles.greenDot} />
                <Text style={styles.userName}>{userName}</Text>
              </View>
            </View>

            {/* Ubicación Actual */}
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={20} color="#333" />
                <Text style={styles.locationTitle}>Ubicación Actual</Text>
              </View>

              {currentLocation && (
                <View style={styles.locationDetails}>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Latitud:</Text>
                    <Text style={styles.locationValue}>{currentLocation.latitude.toFixed(7)}</Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Longitud:</Text>
                    <Text style={styles.locationValue}>{currentLocation.longitude.toFixed(7)}</Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Precisión:</Text>
                    <Text style={styles.locationValue}>
                      {currentLocation.accuracy ? `${Math.round(currentLocation.accuracy)}m` : '37m'}
                    </Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Velocidad:</Text>
                    <Text style={styles.locationValue}>
                      {currentLocation.speed ? `${Math.round(currentLocation.speed * 3.6)} km/h` : '0 km/h'}
                    </Text>
                  </View>

                  <View style={styles.timeSection}>
                    <View style={styles.timeLabelsRow}>
                      <Text style={styles.timeLabel}>Inicio</Text>
                      <Text style={styles.timeLabel}>Tiempo</Text>
                      <Text style={styles.timeLabel}>Última actualización</Text>
                    </View>
                    <View style={styles.timeValuesRow}>
                      <Text style={styles.timeValue}>
                        {startTime ? formatTime(startTime) : '10:57'}
                      </Text>
                      <View style={styles.timeBadge}>
                        <Text style={styles.timeBadgeText}>{elapsedTime}</Text>
                      </View>
                      <Text style={styles.timeValue}>
                        {lastUpdateTime ? formatTime(lastUpdateTime) : '10:57'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Estado Rastreando */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicator}>
                  <View style={styles.greenDot} />
                  <Text style={styles.statusText}>Rastreando</Text>
                </View>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVO</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
                <MaterialIcons name="navigation" size={16} color="white" />
                <Text style={styles.stopButtonText}>Detener</Text>
              </TouchableOpacity>
            </View>

            {/* Detalles */}
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <MaterialIcons name="access-time" size={20} color="#333" />
                <Text style={styles.detailsTitle}>Detalles</Text>
              </View>

              <View style={styles.detailsItem}>
                <Text style={styles.detailsLabel}>Última actualización</Text>
                <Text style={styles.detailsValue}>
                  {lastUpdateTime ? formatTimeWithSeconds(lastUpdateTime) : '10:59:02'}
                </Text>
              </View>

              <TouchableOpacity style={styles.googleMapsButton}>
                <MaterialIcons name="map" size={20} color="#333" />
                <Text style={styles.googleMapsButtonText}>Ver en Google Maps</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
                style={[
                  styles.textInput,
                  userName.trim() ? styles.textInputFilled : null
                ]}
                placeholder="Ingresa el nombre..."
                placeholderTextColor="#999"
                value={userName}
                onChangeText={setUserName}
                autoFocus
                selectionColor="#999"
              />
            </View>

            <View style={styles.featureContainer}>
              <MaterialIcons name="gps-fixed" size={20} color="#007AFF" />
              <Text style={styles.featureTitle}>Rastreo mediante GPS</Text>
              <Text style={styles.featureDescription}>
                El seguimiento utilizará señales de satélite para obtener la ubicación precisa en tiempo real.
              </Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.startTrackingButton,
                  userName.trim() ? styles.startTrackingButtonActive : null
                ]} 
                onPress={startTracking}
              >
                <MaterialIcons name="navigation" size={16} color="white" />
                <Text style={styles.startTrackingButtonText}>Iniciar Rastreo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  gpsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gpsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationDetails: {
    gap: 12,
  },
  locationItem: {
    marginBottom: 8,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  detailsItem: {
    marginBottom: 16,
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
  gpsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activeBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveBadgeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 10,
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
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  },
  timeSection: {
    marginTop: 16,
  },
  timeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  timeValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  timeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  timeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  googleMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  googleMapsButtonText: {
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
    padding: 4,
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
  textInputFilled: {
    borderColor: '#999',
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
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  startTrackingButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  startTrackingButtonActive: {
    backgroundColor: '#333',
  },
  startTrackingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
