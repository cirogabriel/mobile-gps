import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AuthorScreen() {
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={60} color="#666" />
          </View>
          <Text style={styles.authorName}>Ciro Gabriel</Text>
          <Text style={styles.authorTitle}>Desarrollador Mobile</Text>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Text style={styles.aboutText}>
            Desarrollador especializado en aplicaciones móviles con React Native y Expo. 
            Apasionado por crear soluciones tecnológicas innovadoras y funcionales.
          </Text>
        </View>

        {/* Skills Section */}
        <View style={styles.skillsCard}>
          <Text style={styles.sectionTitle}>Tecnologías</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>React Native</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>Expo</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>TypeScript</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>GPS Location</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color="#007AFF" />
            <Text style={styles.contactText}>ciro.gabriel@email.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="link" size={20} color="#007AFF" />
            <Text style={styles.contactText}>github.com/cirogabriel</Text>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.appInfoCard}>
          <Text style={styles.sectionTitle}>Información de la App</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versión:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última actualización:</Text>
            <Text style={styles.infoValue}>Septiembre 2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plataforma:</Text>
            <Text style={styles.infoValue}>React Native + Expo</Text>
          </View>
        </View>
      </ScrollView>
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  authorTitle: {
    fontSize: 16,
    color: '#666',
  },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  skillsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  appInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
