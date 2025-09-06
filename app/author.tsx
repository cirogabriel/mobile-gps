import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AuthorScreen() {
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.authorContainer}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={60} color="#007AFF" />
            </View>
            <Text style={styles.title}>Información del Autor</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>Ciro Gabriel Callapiña Castilla</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="numbers" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Número</Text>
                <Text style={styles.infoValue}>5</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="school" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Profesor</Text>
                <Text style={styles.infoValue}>Jose Mauro Pillco Quispe</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="book" size={20} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Curso</Text>
                <Text style={styles.infoValue}>Sistemas Embebidos</Text>
              </View>
            </View>
          </View>

          <View style={styles.appInfoCard}>
            <View style={styles.appHeader}>
              <MaterialIcons name="gps-fixed" size={24} color="#007AFF" />
              <Text style={styles.appTitle}>GPS Tracker App</Text>
            </View>
            <Text style={styles.appDescription}>
              Aplicación móvil para el seguimiento GPS en tiempo real. 
              Desarrollada como proyecto académico para el curso de Sistemas Embebidos.
            </Text>
            <Text style={styles.appVersion}>Versión 1.0.0</Text>
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Características</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="location-on" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Seguimiento GPS en tiempo real</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="speed" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Medición de velocidad y precisión</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="access-time" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Registro de tiempo de inicio/fin</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="map" size={16} color="#4CAF50" />
                <Text style={styles.featureText}>Visualización en mapa interactivo</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  authorContainer: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
});
