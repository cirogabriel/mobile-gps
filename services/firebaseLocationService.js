import { off, onValue, push, ref, serverTimestamp, set } from 'firebase/database';
import { database } from '../config/firebase';

// Función para calcular la distancia entre dos coordenadas usando la fórmula de Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI/180; // φ, λ en radianes
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // en metros
  return distance;
};

// Función para obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

class FirebaseLocationService {
  constructor() {
    this.lastSavedPosition = null;
    this.currentSessionId = null;
    this.MINIMUM_DISTANCE = 3; // metros mínimos para guardar nueva posición
  }

  // Iniciar sesión de tracking
  async startTrackingSession(userId) {
    try {
      const sessionData = {
        startTime: serverTimestamp(),
        endTime: null,
        isActive: true
      };

      // Crear nueva sesión
      const sessionRef = ref(database, `users/${userId}/sessions`);
      const newSessionRef = push(sessionRef);
      this.currentSessionId = newSessionRef.key;
      
      await set(newSessionRef, sessionData);
      
      console.log('🔥 Firebase: Sesión de tracking iniciada', this.currentSessionId);
      return this.currentSessionId;
    } catch (error) {
      console.error('❌ Error iniciando sesión en Firebase:', error);
      throw error;
    }
  }

  // Finalizar sesión de tracking
  async endTrackingSession(userId) {
    try {
      if (!this.currentSessionId) {
        console.warn('⚠️ No hay sesión activa para finalizar');
        return;
      }

      const sessionRef = ref(database, `users/${userId}/sessions/${this.currentSessionId}`);
      await set(sessionRef, {
        startTime: serverTimestamp(), // Mantener el original
        endTime: serverTimestamp(),
        isActive: false
      });

      // Limpiar posición actual cuando termine la sesión
      const currentPositionRef = ref(database, `users/${userId}/currentPosition`);
      await set(currentPositionRef, null);

      console.log('🔥 Firebase: Sesión de tracking finalizada', this.currentSessionId);
      this.currentSessionId = null;
      this.lastSavedPosition = null;
    } catch (error) {
      console.error('❌ Error finalizando sesión en Firebase:', error);
      throw error;
    }
  }

  // Guardar ubicación en tiempo real
  async saveLocationUpdate(userId, locationData) {
    try {
      const { latitude, longitude, accuracy, speed, timestamp } = locationData;
      
      // 1. SIEMPRE actualizar currentPosition para seguimiento en vivo
      const currentPositionRef = ref(database, `users/${userId}/currentPosition`);
      const currentPositionData = {
        latitude,
        longitude,
        accuracy,
        speed,
        timestamp,
        sessionId: this.currentSessionId,
        lastUpdate: serverTimestamp()
      };
      
      await set(currentPositionRef, currentPositionData);
      console.log('🔥 Firebase: Posición actual actualizada');

      // 2. Verificar si debe guardarse en history (solo si se movió más de 3-4 metros)
      let shouldSaveToHistory = true;
      
      if (this.lastSavedPosition) {
        const distance = calculateDistance(
          this.lastSavedPosition.latitude,
          this.lastSavedPosition.longitude,
          latitude,
          longitude
        );
        
        if (distance < this.MINIMUM_DISTANCE) {
          shouldSaveToHistory = false;
          console.log(`📍 Movimiento menor a ${this.MINIMUM_DISTANCE}m (${distance.toFixed(2)}m), no guardando en history`);
        } else {
          console.log(`📍 Movimiento de ${distance.toFixed(2)}m, guardando en history`);
        }
      }

      // 3. Guardar en history si es necesario
      if (shouldSaveToHistory) {
        const currentDate = getCurrentDate();
        const historyRef = ref(database, `users/${userId}/history/${currentDate}/positions`);
        const newPositionRef = push(historyRef);
        
        const historyData = {
          latitude,
          longitude,
          accuracy,
          speed,
          timestamp,
          sessionId: this.currentSessionId,
          savedAt: serverTimestamp()
        };
        
        await set(newPositionRef, historyData);
        
        // Actualizar última posición guardada
        this.lastSavedPosition = { latitude, longitude };
        console.log('🔥 Firebase: Nueva posición guardada en history');
      }

    } catch (error) {
      console.error('❌ Error guardando ubicación en Firebase:', error);
      throw error;
    }
  }

  // Listener para posición actual (para app web)
  listenToCurrentPosition(userId, callback) {
    const currentPositionRef = ref(database, `users/${userId}/currentPosition`);
    
    const unsubscribe = onValue(currentPositionRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });

    return () => off(currentPositionRef, 'value', unsubscribe);
  }

  // Listener para historial del día (para app web)
  listenToTodayHistory(userId, callback) {
    const currentDate = getCurrentDate();
    const historyRef = ref(database, `users/${userId}/history/${currentDate}/positions`);
    
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const positions = data ? Object.values(data) : [];
      callback(positions);
    });

    return () => off(historyRef, 'value', unsubscribe);
  }

  // Obtener historial de una fecha específica (para app web)
  listenToHistoryByDate(userId, date, callback) {
    const historyRef = ref(database, `users/${userId}/history/${date}/positions`);
    
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const positions = data ? Object.values(data) : [];
      callback(positions);
    });

    return () => off(historyRef, 'value', unsubscribe);
  }

  // Limpiar datos antiguos (para ejecutar desde la app web o cloud functions)
  async cleanOldHistory(userId, hoursToKeep = 7) {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hoursToKeep);
      
      const cutoffDate = cutoffTime.toISOString().split('T')[0];
      
      // Esta función debería ejecutarse desde la app web o cloud functions
      console.log(`🧹 Limpieza de datos anteriores a ${cutoffDate} (implementar en app web)`);
      
    } catch (error) {
      console.error('❌ Error limpiando historial:', error);
    }
  }
}

// Exportar instancia singleton
export const firebaseLocationService = new FirebaseLocationService();
export default FirebaseLocationService;
