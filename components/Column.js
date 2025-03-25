import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import TaskCard from './TaskCard';

/**
 * A single Kanban column (e.g. To Do, Review, Done)
 * Displays a list of tasks filtered to this column’s status
 */
export default function Column({
    column,
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    moveTask,
}) {
    /**
     * Renders each individual TaskCard in the column
     */
    const renderTaskItem = ({ item }) => (
        <TaskCard
            task={item}
            isSelected={selectedTaskId === item.id}
            onSelect={() =>
                setSelectedTaskId(prev => (prev === item.id ? null : item.id))
            }
            moveTask={moveTask}
        />
    );

    return (
        <View style={styles.column}>
            <Text style={styles.title}>{column.title}</Text>

            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={renderTaskItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    column: {
        minWidth: Dimensions.get('window').width * 0.8,
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginRight: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
});
