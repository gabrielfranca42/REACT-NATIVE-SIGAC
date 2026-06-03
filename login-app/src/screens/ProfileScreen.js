// src/screens/ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ProfileScreen({ navigation }) {
  // Simulando os dados que virão do MongoDB futuramente
  const aluno = {
    nome: "Marcelo Silva",
    matricula: "202610984",
    cursos: [
      { id: 1, nome: "Análise e Desenvolvimento de Sistemas", periodo: "2º Período" },
      { id: 2, nome: "Desenvolvimento Mobile Avançado", periodo: "Extensão" }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Avatar/Foto do Aluno fictícia */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{aluno.nome.charAt(0)}</Text>
        </View>
        
        <Text style={styles.name}>{aluno.nome}</Text>
        <Text style={styles.matricula}>Matrícula: {aluno.matricula}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Cursos Matriculados</Text>
        
        {aluno.cursos.map(curso => (
          <View key={curso.id} style={styles.cursoCard}>
            <Text style={styles.cursoNome}>{curso.nome}</Text>
            <Text style={styles.cursoPeriodo}>{curso.periodo}</Text>
          </View>
        ))}

       
          
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  matricula: {
    fontSize: 14,
    color: '#aaa',
  },
  body: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  cursoCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  cursoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cursoPeriodo: {
    fontSize: 14,
    color: '#007AFF',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});