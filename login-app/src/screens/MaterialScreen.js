// src/screens/MaterialScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MaterialScreen() {
  const [tipo, setTipo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const tiposAtividades = [
    'Curso de Extensão', 'Palestra / Seminário', 'Monitoria', 'Estágio', 'Outros Certificados'
  ];

  const handleSelecionarArquivo = () => {
    // Simulação de seleção de arquivo (futuramente usaremos o expo-document-picker ou expo-image-picker)
    setArquivoSelecionado({ name: 'certificado_react_native.pdf' });
    Alert.alert('Sucesso', 'Arquivo selecionado com sucesso!');
  };

  const handleEnviar = () => {
    if (!tipo || !cargaHoraria || !arquivoSelecionado) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos e anexe o certificado.');
      return;
    }

    Alert.alert(
      'Enviado com Sucesso',
      `Seu certificado de "${tipo}" com ${cargaHoraria}h foi enviado para a validação do coordenador.`
    );
    
    // Limpa o formulário após enviar
    setTipo('');
    setCargaHoraria('');
    setArquivoSelecionado(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Subir Novo Certificado</Text>
        <Text style={styles.subtitle}>Envie seus documentos para análise da coordenação</Text>

        <Text style={styles.label}>Tipo de Atividade</Text>
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

        <Text style={styles.label}>Carga Horária (em horas)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 20"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={cargaHoraria}
          onChangeText={setCargaHoraria}
        />

        <Text style={styles.label}>Documento (JPEG ou PDF)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleSelecionarArquivo}>
          <Ionicons name="document-attach-outline" size={24} color="#007AFF" />
          <Text style={styles.uploadButtonText}>
            {arquivoSelecionado ? arquivoSelecionado.name : 'Selecionar Certificado'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleEnviar}>
          <Text style={styles.submitButtonText}>Enviar para o Coordenador</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  card: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8, marginTop: 12 },
  pickerSimulado: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tipoBotao: { backgroundColor: '#2a2a2a', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#444' },
  tipoBotaoAtivo: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  tipoBotaoText: { color: '#aaa', fontSize: 13 },
  tipoBotaoTextAtivo: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 14, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#444' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2a2a', padding: 16, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#007AFF', marginTop: 4, gap: 8 },
  uploadButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#34c759', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});