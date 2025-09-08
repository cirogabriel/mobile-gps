import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente simple para verificar que la app carga correctamente
export default function TestComponent() {
    console.log('✅ TestComponent cargado correctamente');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>✅ App Funcionando</Text>
                <Text style={styles.subtitle}>
                    Si ves este mensaje, la aplicación se está cargando correctamente.
                </Text>
                <Text style={styles.info}>
                    Esto significa que el problema del splash screen blanco está resuelto.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#007bff',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    info: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
});
