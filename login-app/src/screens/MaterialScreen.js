// src/screens/MaterialScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Linking, Modal, Image } from 'react-native';
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
  const [certificadoAberto, setCertificadoAberto] = useState(null); // Estado para controlar o modal

  const [tiposAtividades, setTiposAtividades] = useState([]);

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const userObj = JSON.parse(userData);
          
          // Buscar categorias reais do curso para o select de tipo
          if (userObj.courses && userObj.courses.length > 0) {
            const courseId = userObj.courses[0];
            const { data: coursesData } = await api.get('/courses');
            const meuCurso = coursesData.find(c => c._id === courseId);
            if (meuCurso && meuCurso.categories) {
              setTiposAtividades(meuCurso.categories.map(cat => cat.name));
            }
          }

          const { data } = await api.get('/activities', { params: { studentId: userObj.id || userObj._id } });
          
          const myActivities = (data || []).map(act => ({
            id: act._id,
            nome: act.title || 'Certificado',
            tipo: act.category,
            horas: act.hoursClaimed,
            status: act.status === 'APPROVED' ? 'Aprovado' : act.status === 'PENDING' ? 'Pendente' : 'Rejeitado',
            motivo: act.feedback || '',
            fileUrl: act.fileUrl || ''
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
      formData.append('courseId', userObj.courses[0]);
      formData.append('title', `Certificado de ${tipo}`);
      formData.append('category', tipo);
      formData.append('hoursClaimed', cargaHoraria);
      
      formData.append('certificate', {
        uri: arquivoSelecionado.uri,
        name: arquivoSelecionado.name || 'documento.pdf',
        type: arquivoSelecionado.mimeType || 'application/pdf'
      });

      // NO REACT NATIVE: O Axios tem bugs crônicos para enviar FormData (o body chega vazio ou corrompido no backend).
      // A solução definitiva aprovada pela comunidade é usar o `fetch` nativo para uploads de arquivos.
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://projeto-senac-geraldo-1.onrender.com/api/v1/activities', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NÃO definimos Content-Type. O fetch faz isso sozinho e injeta o 'boundary' obrigatório.
        },
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro desconhecido do servidor');
      }

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
        motivo: act.feedback || '',
        fileUrl: act.fileUrl || ''
      }));
      setHistoricoEnvios(myActivities);

    } catch (error) {
      console.warn('Erro ao enviar atividade (Log Interno):', error);
      
      let mensagemBackend = error.message || 'Ocorreu um erro ao tentar se conectar com o servidor.';
      
      // Limpando o texto técnico que o backend envia (ex: "UNPROCESSABLE_ENTITY: ")
      if (mensagemBackend.includes('UNPROCESSABLE_ENTITY:')) {
        mensagemBackend = mensagemBackend.replace('UNPROCESSABLE_ENTITY:', '').trim();
      } else if (mensagemBackend.includes('BAD_REQUEST:')) {
        mensagemBackend = mensagemBackend.replace('BAD_REQUEST:', '').trim();
      }

      Alert.alert('Aviso do Sistema', mensagemBackend);
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
        <TouchableOpacity 
          key={envio.id} 
          style={[styles.itemHistorico, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {
            if (envio.fileUrl) {
              setCertificadoAberto(envio);
            } else {
              Alert.alert('Aviso', 'Este envio não possui um arquivo anexo.');
            }
          }}
          activeOpacity={0.7}
        >
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
        </TouchableOpacity>
      ))}

      {/* Margem inferior de segurança para rolagem */}
      <View style={{ height: 40 }} />

      {/* MODAL DE VISUALIZAÇÃO DO CERTIFICADO */}
      <Modal
        visible={!!certificadoAberto}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCertificadoAberto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Detalhes do Envio</Text>
              <TouchableOpacity onPress={() => setCertificadoAberto(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {certificadoAberto && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.modalInfoBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Text style={[styles.modalInfoLabel, { color: theme.textSecondary }]}>Tipo de Atividade</Text>
                  <Text style={[styles.modalInfoValue, { color: theme.text }]}>{certificadoAberto.tipo}</Text>
                  
                  <Text style={[styles.modalInfoLabel, { color: theme.textSecondary, marginTop: 12 }]}>Carga Horária</Text>
                  <Text style={[styles.modalInfoValue, { color: theme.text }]}>{certificadoAberto.horas} horas</Text>
                  
                  <Text style={[styles.modalInfoLabel, { color: theme.textSecondary, marginTop: 12 }]}>Status</Text>
                  <Text style={[styles.modalInfoValue, { color: obterCorStatus(certificadoAberto.status) }]}>{certificadoAberto.status}</Text>
                </View>

                <Text style={[styles.modalImageLabel, { color: theme.text }]}>Documento Anexado:</Text>
                
                {certificadoAberto.fileUrl && certificadoAberto.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <View style={styles.pdfContainer}>
                    <Ionicons name="document-text" size={48} color={theme.textSecondary} style={{ marginBottom: 12 }} />
                    <Text style={{ color: theme.text, marginBottom: 16, textAlign: 'center' }}>
                      Este arquivo é um PDF e não pode ser visualizado diretamente aqui.
                    </Text>
                    <TouchableOpacity 
                      style={styles.pdfButton}
                      onPress={() => {
                        const urlCompleta = certificadoAberto.fileUrl.startsWith('http') 
                          ? certificadoAberto.fileUrl 
                          : `https://projeto-senac-geraldo-1.onrender.com${certificadoAberto.fileUrl}`;
                        Linking.openURL(urlCompleta);
                      }}
                    >
                      <Ionicons name="open-outline" size={20} color="#fff" />
                      <Text style={styles.pdfButtonText}>Abrir PDF Externamente</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ 
                        uri: certificadoAberto.fileUrl.startsWith('http') 
                          ? certificadoAberto.fileUrl 
                          : `https://projeto-senac-geraldo-1.onrender.com${certificadoAberto.fileUrl}` 
                      }} 
                      style={styles.certificadoImagem}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  motivoText: { color: '#ff3b30', fontSize: 12, fontWeight: '500' },
  
  // Estilos do Modal de Visualização
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 },
  modalContent: { borderRadius: 16, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 4 },
  modalInfoBox: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  modalInfoLabel: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  modalInfoValue: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  modalImageLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  imageContainer: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e5e5ea' },
  certificadoImagem: { width: '100%', height: '100%' },
  
  // Estilos específicos para PDFs
  pdfContainer: { width: '100%', padding: 20, borderRadius: 12, backgroundColor: '#f0f0f5', alignItems: 'center', justifyContent: 'center' },
  pdfButton: { flexDirection: 'row', backgroundColor: '#004a8d', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', gap: 8 },
  pdfButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});