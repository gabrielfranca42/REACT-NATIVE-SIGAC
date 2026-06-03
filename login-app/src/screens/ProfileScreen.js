// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, theme, toggleTheme } = useTheme();

  const aluno = {
    nome: 'Marcelo Silva',
    matricula: '202610984',
    cursos: [
      { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', periodo: '2º Período' },
      { id: 2, nome: 'Desenvolvimento Mobile Avançado', periodo: 'Extensão' }
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Botão de Alternar Tema Superior */}
      <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.card }]} onPress={toggleTheme}>
        <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={22} color={theme.text} />
        <Text style={[styles.themeToggleText, { color: theme.text }]}>
          Modo {isDarkMode ? 'Claro' : 'Escuro'}
        </Text>
      </TouchableOpacity>

      {/* Card do Perfil */}
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{aluno.nome}</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>Matrícula: {aluno.matricula}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Cursos Matriculados</Text>

      {aluno.cursos.map(curso => (
        <View key={curso.id} style={[styles.cursoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cursoNome, { color: theme.text }]}>{curso.nome}</Text>
          <Text style={styles.cursoPeriodo}>{curso.periodo}</Text>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  themeToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 25, marginBottom: 16, alignSelf: 'flex-end', gap: 6, borderWidth: 1, borderColor: 'transparent' },
  themeToggleText: { fontSize: 14, fontWeight: '600' },
  profileCard: { alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sub: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cursoCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cursoNome: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cursoPeriodo: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  logoutButton: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});