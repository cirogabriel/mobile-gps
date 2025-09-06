import { MaterialIcons } from '@expo/vector-icons';
import { Satellite, User } from 'lucide-react-native';
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

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Academic Info Card */}
        <View style={styles.academicCard}>
          {/* Header with icon */}
          <View style={styles.cardHeader}>
            <User size={20} color="#000000" strokeWidth={2} />
            <Text style={styles.cardTitle}>Información del Autor</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Autor:</Text>
            <Text style={styles.infoValue}>Ciro Gabriel Callapiña Castilla</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número:</Text>
            <Text style={styles.infoValue}>5</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Docente:</Text>
            <Text style={styles.infoValue}>Jose Mauro Pillco Quispe</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Curso:</Text>
            <Text style={styles.infoValue}>Sistemas Embebidos</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Proyecto:</Text>
            <Text style={styles.infoValue}>GPS Tracker Mobile App</Text>
          </View>

          {/* App Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Aplicación móvil desarrollada con React Native y Expo para rastreo GPS en tiempo real. 
              Permite monitorear ubicación, velocidad y precisión utilizando tecnología de geolocalización.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Proyecto con propósito académico</Text>
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
  contentContainer: {
    alignItems: 'center',
  },
  academicCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 20,
    width: '85%',
    maxWidth: 320,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
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
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
