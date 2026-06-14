// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, theme, toggleTheme } = useTheme();
  
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [aluno, setAluno] = useState({ nome: '', matricula: '', cursos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          const { data: coursesData } = await api.get('/courses');
          
          const meusCursos = coursesData
            .filter(c => (userObj.courses || []).includes(c._id))
            .map(c => ({ id: c._id, nome: c.name, periodo: 'Matriculado' }));

          setAluno({
            nome: userObj.name,
            matricula: userObj.matricula || userObj.email,
            cursos: meusCursos
          });

          if (meusCursos.length > 0) {
            setCursoSelecionado(meusCursos[0].id);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar perfil', err);
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleSelecionarCurso = (id, nome) => {
    setCursoSelecionado(id);
    console.log(`Curso ativo alterado para: ${nome}`);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Botão de Alternar Tema */}
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

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Selecione o Curso Ativo</Text>

      {/* Listagem Interativa de Cursos */}
      {aluno.cursos.map(curso => {
        const estaAtivo = cursoSelecionado === curso.id;

        return (
          <TouchableOpacity 
            key={curso.id} 
            activeOpacity={0.7}
            style={[
              styles.cursoCard, 
              { 
                backgroundColor: theme.card, 
                borderColor: estaAtivo ? theme.button : theme.border,
                borderWidth: estaAtivo ? 2 : 1 
              }
            ]}
            onPress={() => handleSelecionarCurso(curso.id, curso.nome)}
          >
            <View style={styles.cursoInfo}>
              <Text style={[styles.cursoNome, { color: theme.text }]}>{curso.nome}</Text>
              <Text style={styles.cursoPeriodo}>{curso.periodo}</Text>
            </View>
            
            {/* Ícone indicador se o curso está selecionado ou não */}
            <Ionicons 
              name={estaAtivo ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={estaAtivo ? theme.button : theme.textSecondary} 
            />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
      
      {/* Espaçamento extra no fim do ScrollView para não cobrir o menu inferior */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  themeToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 25, marginBottom: 16, alignSelf: 'flex-end', gap: 6 },
  themeToggleText: { fontSize: 14, fontWeight: '600' },
  profileCard: { alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#004a8d', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sub: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cursoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 12 },
  cursoInfo: { flex: 1, paddingRight: 8 },
  cursoNome: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cursoPeriodo: { color: '#004a8d', fontSize: 14, fontWeight: '600' },
  logoutButton: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});