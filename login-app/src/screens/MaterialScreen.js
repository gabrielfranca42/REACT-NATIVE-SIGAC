// src/screens/MaterialScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import * as DocumentPicker from 'expo-document-picker';

export default function MaterialScreen() {
  const { theme } = useTheme();
  const [tipo, setTipo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [historicoEnvios, setHistoricoEnvios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          const { data } = await api.get('/activities', { params: { studentId: userObj.id || userObj._id } });
          
          const myActivities = (data || []).map(act => ({
            id: act._id,
            nome: act.title || 'Certificado',
            tipo: act.category,
            horas: act.hoursClaimed,
            status: act.status === 'APPROVED' ? 'Aprovado' : act.status === 'PENDING' ? 'Pendente' : 'Rejeitado',
            motivo: act.feedback || ''
          }));
          
          setHistoricoEnvios(myActivities);
        }
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarAtividades();
  }, []);

  const tiposAtividades = [
    'Curso de Extensão', 'Palestra / Seminário', 'Monitoria', 'Estágio', 'Outros Certificados'
  ];

  const handleSelecionarArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setArquivoSelecionado(result.assets[0]);
      }
    } catch (err) {
      console.error('Erro ao escolher arquivo', err);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const handleEnviar = async () => {
    if (!tipo || !cargaHoraria || !arquivoSelecionado) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos e anexe o certificado.');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      const userObj = JSON.parse(userData);

      const formData = new FormData();
      formData.append('student', userObj.id || userObj._id);
      formData.append('course', userObj.courses[0]);
      formData.append('title', `Certificado de ${tipo}`);
      formData.append('category', tipo);
      formData.append('hoursClaimed', cargaHoraria);
      
      formData.append('certificate', {
        uri: arquivoSelecionado.uri,
        name: arquivoSelecionado.name,
        type: arquivoSelecionado.mimeType || 'application/pdf'
      });

      await api.post('/activities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso', 'Certificado enviado para análise do coordenador!');
      
      setTipo('');
      setCargaHoraria('');
      setArquivoSelecionado(null);
      
      const { data } = await api.get('/activities', { params: { studentId: userObj.id || userObj._id } });
      const myActivities = (data || []).map(act => ({
        id: act._id,
        nome: act.title || 'Certificado',
        tipo: act.category,
        horas: act.hoursClaimed,
        status: act.status === 'APPROVED' ? 'Aprovado' : act.status === 'PENDING' ? 'Pendente' : 'Rejeitado',
        motivo: act.feedback || ''
      }));
      setHistoricoEnvios(myActivities);

    } catch (error) {
      console.error('Erro ao enviar atividade:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar o certificado.');
    }
  };

  // Função auxiliar para pintar a tag de status correta
  const obterCorStatus = (status) => {
    if (status === 'Aprovado') return '#34c759'; // Verde
    if (status === 'Pendente') return '#e6a23c'; // Laranja
    return '#ff3b30'; // Vermelho
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* SEÇÃO 1: Formulário de Envio */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Subir Novo Certificado</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Envie seus documentos para análise da coordenação</Text>

        <Text style={[styles.label, { color: theme.text }]}>Tipo de Atividade</Text>
        <View style={styles.pickerSimulado}>
          {tiposAtividades.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.tipoBotao, tipo === item && styles.tipoBotaoAtivo]}
              onPress={() => setTipo(item)}
            >
              <Text style={[styles.tipoBotaoText, tipo === item && styles.tipoBotaoTextAtivo]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Carga Horária (em horas)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          placeholder="Ex: 20"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cargaHoraria}
          onChangeText={setCargaHoraria}
        />

        <Text style={[styles.label, { color: theme.text }]}>Documento (JPEG ou PDF)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleSelecionarArquivo}>
          <Ionicons name="document-attach-outline" size={24} color="#004a8d" />
          <Text style={styles.uploadButtonText}>
            {arquivoSelecionado ? arquivoSelecionado.name : 'Selecionar Certificado'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleEnviar}>
          <Text style={styles.submitButtonText}>Enviar para o Coordenador</Text>
        </TouchableOpacity>
      </View>

      {/* SEÇÃO 2: Histórico de Documentos Enviados */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Meus Envios ({historicoEnvios.length})</Text>

      {historicoEnvios.map((envio) => (
        <View key={envio.id} style={[styles.itemHistorico, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.historicoHeader}>
            <View style={styles.arquivoInfo}>
              <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.nomeArquivo, { color: theme.text }]} numberOfLines={1}>
                {envio.name || envio.nome}
              </Text>
            </View>
            {/* Tag de Status Dinâmica */}
            <View style={[styles.tagStatus, { backgroundColor: obterCorStatus(envio.status) + '22', borderColor: obterCorStatus(envio.status) }]}>
              <Text style={[styles.tagStatusText, { color: obterCorStatus(envio.status) }]}>{envio.status}</Text>
            </View>
          </View>

          <View style={styles.historicoDetalhes}>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Tipo: <Text style={{ color: theme.text, fontWeight: '500' }}>{envio.tipo}</Text></Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Carga: <Text style={{ color: theme.text, fontWeight: '500' }}>{envio.horas}h</Text></Text>
          </View>

          {/* Se foi rejeitado, mostra o balão com o motivo do coordenador */}
          {envio.status === 'Rejeitado' && envio.motivo && (
            <View style={styles.motivoContainer}>
              <Text style={styles.motivoText}>❌ Motivo: {envio.motivo}</Text>
            </View>
          )}
        </View>
      ))}

      {/* Margem inferior de segurança para rolagem */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  pickerSimulado: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tipoBotao: { backgroundColor: '#2a2a2a', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#444' },
  tipoBotaoAtivo: { backgroundColor: '#004a8d', borderColor: '#004a8d' },
  tipoBotaoText: { color: '#aaa', fontSize: 13 },
  tipoBotaoTextAtivo: { color: '#fff', fontWeight: 'bold' },
  input: { padding: 14, borderRadius: 8, fontSize: 16, borderWidth: 1 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', padding: 16, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#004a8d', marginTop: 4, gap: 8 },
  uploadButtonText: { color: '#004a8d', fontSize: 16, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#34c759', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Estilos do Histórico
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  itemHistorico: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  historicoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  arquivoInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  nomeArquivo: { fontSize: 15, fontWeight: '600' },
  tagStatus: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
  tagStatusText: { fontSize: 11, fontWeight: 'bold' },
  historicoDetalhes: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'transparent', paddingTop: 4 },
  motivoContainer: { marginTop: 8, backgroundColor: '#2a1a1a', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ff3b30' },
  motivoText: { color: '#ff3b30', fontSize: 12, fontWeight: '500' }
});