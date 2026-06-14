// src/screens/DashboardScreen.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen() {
  const { theme } = useTheme();
  // Dados simulando o total exigido vs o aprovado pelo coordenador
  const resumoHoras = {
    totalExigido: 120,
    totalAprovado: 75,
    statusCoordenador: "2 certificados aguardando análise",
    categorias: [
      { id: 1, nome: "Cursos de Extensão", atuais: 40, meta: 50 },
      { id: 2, nome: "Palestras e Eventos", atuais: 15, meta: 20 },
      { id: 3, nome: "Estágio / Monitoria", atuais: 20, meta: 50 },
    ]
  };

  const progressoGeral = (resumoHoras.totalAprovado / resumoHoras.totalExigido) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Card de Visão Geral */}
      <View style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Horas Complementares</Text>
        <Text style={[styles.progressText, { color: theme.text }]}>
          {resumoHoras.totalAprovado}h de {resumoHoras.totalExigido}h concluídas
        </Text>
        
        {/* Barra de progresso principal */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressoGeral}%`, backgroundColor: theme.button }]} />
        </View>

        <View style={[styles.alertaCoordenador, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}>
          <Text style={[styles.alertaText, { color: theme.accent }]}>ℹ️ {resumoHoras.statusCoordenador}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Progresso por Categoria</Text>

      {/* Listagem do progresso por curso/categoria */}
      {resumoHoras.categorias.map((cat) => {
        const progressoCat = (cat.atuais / cat.meta) * 100;
        const pertoDeConcluir = progressoCat >= 75; // Alerta visual se passar de 75%

        return (
          <View key={cat.id} style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryName, { color: theme.text }]}>{cat.nome}</Text>
              <Text style={[styles.categoryHours, { color: theme.textSecondary }]}>{cat.atuais}h / {cat.meta}h</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressoCat}%`, backgroundColor: pertoDeConcluir ? '#34c759' : theme.button }
                ]} 
              />
            </View>

            {pertoDeConcluir && (
              <Text style={styles.statusPerto}>🎉 Quase concluído nesta categoria!</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  mainCard: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  cardTitle: { fontSize: 16, color: '#aaa', fontWeight: '600', marginBottom: 4 },
  progressText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  progressBarBackground: { height: 12, backgroundColor: '#333', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#004a8d', borderRadius: 6 },
  alertaCoordenador: { marginTop: 12, backgroundColor: '#2a2115', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#e6a23c' },
  alertaText: { color: '#e6a23c', fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12, marginTop: 8 },
  categoryCard: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 12 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryName: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  categoryHours: { fontSize: 14, color: '#aaa' },
  statusPerto: { color: '#34c759', fontSize: 12, fontWeight: '600', marginTop: 4 }
});