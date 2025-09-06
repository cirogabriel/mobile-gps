import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Satellite, Send } from 'lucide-react-native';
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
    View
} from 'react-native';

// Definir el task para rastreo en segundo plano
const LOCATION_TASK_NAME = 'background-location-task';

// Definir el handler del task fuera del componente
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Error en background location task:', error);
        return;
    }
    if (data) {
        const { locations } = data as any;
        if (locations && locations.length > 0) {
            const location = locations[0];
            console.log('Background location update:', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                speed: location.coords.speed,
                timestamp: location.timestamp,
            });

            // Aquí puedes guardar la ubicación en AsyncStorage o enviarla a un servidor
            // Para mantener el estado actualizado incluso en background
        }
    }
});

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
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState('0s');

    useEffect(() => {
        // Solo pedir permisos cuando el usuario quiera iniciar tracking
        // No al cargar la app
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

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            // Limpiar interval de foreground si existe
            if ((global as any).locationInterval) {
                clearInterval((global as any).locationInterval);
                (global as any).locationInterval = null;
            }

            // Detener background location al desmontar componente
            const cleanup = async () => {
                try {
                    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
                    if (isTaskDefined) {
                        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
                        if (hasStarted) {
                            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                        }
                    }
                } catch (error) {
                    console.warn('Error en cleanup:', error);
                }
            };

            cleanup();
        };
    }, []);

    const startTracking = async () => {
        if (!userName.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu nombre');
            return;
        }

        try {
            // Paso 1: Pedir permisos foreground
            let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert('Permiso requerido', 'Se necesita acceso a la ubicación para usar esta app');
                return;
            }
            console.log('✅ Permisos foreground concedidos');

            // Paso 2: Verificar que location services estén habilitados
            const enabled = await Location.hasServicesEnabledAsync();
            if (!enabled) {
                Alert.alert(
                    'Servicios de ubicación deshabilitados',
                    'Por favor habilita los servicios de ubicación en la configuración de tu dispositivo'
                );
                return;
            }
            console.log('✅ Servicios de ubicación habilitados');

            // Paso 3: Solicitar permisos de background con explicación
            Alert.alert(
                'Permisos de segundo plano',
                'Para que la app continúe rastreando tu ubicación cuando esté en segundo plano, necesitamos permisos adicionales. En la siguiente pantalla, selecciona "Permitir todo el tiempo".',
                [
                    {
                        text: 'Continuar',
                        onPress: async () => {
                            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                            console.log('Estado permisos background:', backgroundStatus);

                            if (backgroundStatus === 'granted') {
                                console.log('✅ Permisos background concedidos');
                                await proceedWithTracking(true);
                            } else {
                                console.log('⚠️ Permisos background NO concedidos, usando solo foreground');
                                Alert.alert(
                                    'Aviso',
                                    'Sin permisos de segundo plano, el tracking se pausará cuando salgas de la app. ¿Continuar de todos modos?',
                                    [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Continuar', onPress: () => proceedWithTracking(false) }
                                    ]
                                );
                            }
                        }
                    },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );

        } catch (error) {
            console.error('Error en permisos:', error);
            Alert.alert('Error', 'Error al solicitar permisos de ubicación');
        }
    };

    const proceedWithTracking = async (hasBackgroundPermission: boolean) => {
        setShowModal(false);
        setIsTracking(true);
        const now = new Date();
        setStartTime(now);
        setLastUpdateTime(now);

        try {
            // Obtener ubicación inicial con configuración más robusta
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
            console.log('📍 Ubicación inicial obtenida:', locationData);

            // Detener cualquier task anterior
            try {
                const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
                if (isTaskDefined) {
                    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
                    if (hasStarted) {
                        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                    }
                }
            } catch (cleanupError) {
                console.log('Error en cleanup, continuando...', cleanupError);
            }

            // Iniciar background tracking si tenemos permisos
            if (hasBackgroundPermission) {
                try {
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 0,
                        deferredUpdatesInterval: 5000,
                        foregroundService: {
                            notificationTitle: '🛰️ GPS Tracker Activo',
                            notificationBody: 'Rastreando ubicación en segundo plano',
                            notificationColor: '#000000',
                        },
                        pausesUpdatesAutomatically: false,
                        activityType: Location.ActivityType.Other,
                        showsBackgroundLocationIndicator: true,
                    });
                    console.log('🚀 Background location tracking iniciado exitosamente');
                } catch (bgError) {
                    console.error('❌ Error iniciando background location:', bgError);
                    startForegroundTracking();
                }
            } else {
                console.log('📱 Usando solo foreground tracking');
                startForegroundTracking();
            }

            // SIEMPRE iniciar foreground tracking para actualizaciones inmediatas
            startForegroundTracking();

        } catch (error) {
            console.error('Error iniciando location tracking:', error);
            Alert.alert('Error', 'No se pudo iniciar el rastreo de ubicación');
            setIsTracking(false);
        }
    };

    // Función para tracking en primer plano como fallback
    const startForegroundTracking = () => {
        if ((global as any).locationInterval) {
            clearInterval((global as any).locationInterval);
        }

        const interval = setInterval(async () => {
            try {
                // Verificar que location services sigan habilitados
                const enabled = await Location.hasServicesEnabledAsync();
                if (!enabled) {
                    console.error('❌ Location services deshabilitados');
                    return;
                }

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
                console.log('📍 Foreground update:', {
                    lat: newLocationData.latitude.toFixed(6),
                    lng: newLocationData.longitude.toFixed(6),
                    accuracy: newLocationData.accuracy
                });
            } catch (error) {
                console.error('❌ Error getting foreground location:', error);
                // No detener el interval, solo reportar el error
            }
        }, 5000);

        (global as any).locationInterval = interval;
        console.log('🔄 Foreground tracking iniciado');
    };

    const stopTracking = async () => {
        try {
            setIsTracking(false);

            // Detener background tracking si está activo
            try {
                const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
                if (isTaskDefined) {
                    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
                    if (hasStarted) {
                        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                        console.log('Background location tracking detenido');
                    }
                }
            } catch (bgError) {
                console.warn('Error deteniendo background location:', bgError);
            }

            // Detener foreground tracking si está activo
            if ((global as any).locationInterval) {
                clearInterval((global as any).locationInterval);
                (global as any).locationInterval = null;
                console.log('Foreground location tracking detenido');
            }

            // Limpiar estado
            setCurrentLocation(null);
            setStartTime(null);
            setLastUpdateTime(null);
            setElapsedTime('0s');

            console.log('Tracking completamente detenido');
        } catch (error) {
            console.error('Error deteniendo location tracking:', error);
            // Aún así limpiar el estado local
            setIsTracking(false);
            setCurrentLocation(null);
            setStartTime(null);
            setLastUpdateTime(null);
            setElapsedTime('0s');
        }
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
                    <Satellite size={20} color="#333" strokeWidth={2} />
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
                    <Text style={styles.searchPlaceholder}>Buscar ubicación...</Text>
                </View>

                {!isTracking ? (
                    // Estado inicial - Detenido (como primera imagen)
                    <View style={styles.initialContainer}>
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
                                <Send size={16} color="white" strokeWidth={2} />
                                <Text style={styles.startButtonText}>Iniciar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Estado rastreando
                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        {/* Geolocalización via GPS */}
                        <View style={styles.gpsCard}>
                            <View style={styles.gpsHeader}>
                                <View style={styles.gpsIndicator}>
                                    <Satellite size={16} color="#4CAF50" strokeWidth={2} />
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
                                <Send size={16} color="white" strokeWidth={2} />
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
                            <View style={styles.titleRow}>
                                <Satellite size={32} color="#000000" strokeWidth={2} />
                                <View style={styles.titleContainer}>
                                    <Text style={styles.modalTitle}>Iniciar Rastreo GPS</Text>
                                    <Text style={styles.modalSubtitle}>Seguimiento por satélite</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Nombre del usuario a rastrear</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    userName.trim() ? styles.textInputFilled : null,
                                    isInputFocused ? styles.textInputFocused : null
                                ]}
                                placeholder="Ingresa el nombre..."
                                placeholderTextColor="#999"
                                value={userName}
                                onChangeText={setUserName}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoFocus
                                selectionColor="#999"
                                cursorColor="#999"
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <View style={styles.featureContainer}>
                            <View style={styles.featureRow}>
                                <Satellite size={20} color="#000000" strokeWidth={2} />
                                <View style={styles.featureTextContainer}>
                                    <Text style={styles.featureTitle}>Rastreo mediante GPS</Text>
                                    <Text style={styles.featureDescription}>
                                        El seguimiento utilizará señales de satélite para obtener la ubicación precisa en tiempo real.
                                    </Text>
                                </View>
                            </View>
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
                                <Send size={16} color="white" strokeWidth={2} />
                                <Text style={styles.startTrackingButtonText}>Iniciar</Text>
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
    initialContainer: {
        flex: 1,
        paddingTop: 8, // Mismo margen que marginBottom del searchContainer
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
        marginTop: 16,
    },
    searchPlaceholder: {
        fontSize: 16,
        color: '#999',
        marginLeft: 8,
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
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    titleContainer: {
        flex: 1,
    },
    satelliteIcon: {
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
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
    textInputFocused: {
        borderColor: '#999',
        borderWidth: 1,
    },
    featureContainer: {
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureIcon: {
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
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
        color: '#000000',
        fontWeight: '500',
    },
});
