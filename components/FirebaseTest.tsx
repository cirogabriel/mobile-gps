import { get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { database } from '../config/firebase';

export default function FirebaseTest() {
    const [connectionStatus, setConnectionStatus] = useState('Verificando...');

    const testFirebaseConnection = async () => {
        try {
            // Intentar escribir un dato de prueba
            const testRef = ref(database, 'test/connection');
            await set(testRef, {
                timestamp: Date.now(),
                message: 'Firebase conectado correctamente',
            });

            // Intentar leer el dato
            const snapshot = await get(testRef);
            if (snapshot.exists()) {
                setConnectionStatus('✅ Firebase funcionando correctamente');
                Alert.alert('Éxito', 'Firebase está conectado y funcionando!');
            } else {
                setConnectionStatus('❌ Error al leer datos');
            }
        } catch (error) {
            console.error('Error testing Firebase:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setConnectionStatus(`❌ Error: ${errorMessage}`);
            Alert.alert('Error', `Firebase error: ${errorMessage}`);
        }
    };

    useEffect(() => {
        testFirebaseConnection();
    }, []);

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
                Estado de Firebase:
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                {connectionStatus}
            </Text>
            <TouchableOpacity
                onPress={testFirebaseConnection}
                style={{
                    backgroundColor: '#007bff',
                    padding: 15,
                    borderRadius: 5,
                }}
            >
                <Text style={{ color: 'white' }}>Probar Conexión Nuevamente</Text>
            </TouchableOpacity>
        </View>
    );
}
