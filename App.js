import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import KanbanBoard from './screens/KanbanBoard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <KanbanBoard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});