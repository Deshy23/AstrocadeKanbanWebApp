import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Button,
    Modal,
    TextInput,
    StyleSheet,
} from 'react-native';

import { fetchTasks } from '../api/MockTasks';
import Column from '../components/Column';
import { TASK_STATUSES } from '../utils/Constants';

/**
 * Main Kanban board screen
 * - Renders task columns
 * - Manages task creation and filtering
 * - Holds core app state
 */
export default function KanbanBoard() {
    // Application-wide state
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [newTask, setNewTask] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // Filters for metadata
    const [filter, setFilter] = useState({
        assignee: '',
        priority: '',
    });

    // Load 1000 mock tasks once on mount
    useEffect(() => {
        fetchTasks(1000).then(setTasks);
    }, []);

    /**
     * Adds a new task to the "To Do" column
     */
    const addTask = () => {
        const task = {
            id: `task-${Date.now()}`,
            name: newTask.name || 'Untitled',
            description: newTask.description || '',
            date: newTask.date || new Date().toISOString(),
            priority: newTask.priority || 'Low',
            assignee: newTask.assignee || 'Unassigned',
            status: 'todo',
        };

        setTasks(prev => [task, ...prev]);
        setNewTask({});
        setModalVisible(false);
    };

    /**
     * Moves a task left or right in the column flow
     * @param {string} taskId 
     * @param {"left"|"right"} direction 
     */
    const moveTask = (taskId, direction) => {
        const task = tasks.find(t => t.id === taskId);
        const currentIndex = TASK_STATUSES.findIndex(c => c.status === task.status);
        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= TASK_STATUSES.length) return;

        const newStatus = TASK_STATUSES[newIndex].status;
        setTasks(prev =>
            prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
    };

    /**
     * Filters all tasks by column + metadata
     * @param {string} columnStatus 
     * @returns filtered tasks
     */
    const filterTasks = (columnStatus) => {
        return tasks
            .filter(t => t.status === columnStatus)
            .filter(t =>
                filter.assignee
                    ? t.assignee.toLowerCase().includes(filter.assignee.toLowerCase())
                    : true
            )
            .filter(t =>
                filter.priority
                    ? t.priority.toLowerCase() === filter.priority.toLowerCase()
                    : true
            );
    };

    /**
     * Form UI for adding a new task
     */
    const renderNewTaskModal = () => (
        <Modal visible={modalVisible} animationType="slide">
            <View style={styles.modalContent}>
                {['name', 'description', 'date', 'priority', 'assignee'].map(field => (
                    <TextInput
                        key={field}
                        placeholder={capitalize(field)}
                        onChangeText={text => setNewTask(prev => ({ ...prev, [field]: text }))}
                        style={styles.input}
                        multiline={field === 'description'}
                    />
                ))}
                <Button title="Create Task" onPress={addTask} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
        </Modal>
    );

    /**
     * Overlay modal for filter options
     */
    const renderFilterModal = () => (
        <Modal visible={filterVisible} animationType="slide" transparent>
            <View style={styles.filterOverlay}>
                <View style={styles.filterBox}>
                    <Text style={styles.filterTitle}>Filter Tasks</Text>

                    <Text style={styles.filterLabel}>Priority</Text>
                    <View style={styles.filterRow}>
                        {['', 'Low', 'Medium', 'High'].map(level => (
                            <Button
                                key={level}
                                title={level || 'All'}
                                onPress={() =>
                                    setFilter(prev => ({ ...prev, priority: level }))
                                }
                                color={filter.priority === level ? 'blue' : 'gray'}
                            />
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>Assignee</Text>
                    <TextInput
                        placeholder="Enter assignee name"
                        value={filter.assignee}
                        onChangeText={text =>
                            setFilter(prev => ({ ...prev, assignee: text }))
                        }
                        style={styles.input}
                    />

                    <Button title="Close" onPress={() => setFilterVisible(false)} />
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <Button title="Add Task" onPress={() => setModalVisible(true)} />

            <View style={styles.topBar}>
                <Button title="Filter" onPress={() => setFilterVisible(true)} />
            </View>

            <ScrollView horizontal contentContainerStyle={styles.board}>
                {TASK_STATUSES.map(col => (
                    <Column
                        key={col.status}
                        column={col}
                        tasks={filterTasks(col.status)}
                        setTasks={setTasks}
                        selectedTaskId={selectedTaskId}
                        setSelectedTaskId={setSelectedTaskId}
                        moveTask={moveTask}
                    />
                ))}
            </ScrollView>

            {renderNewTaskModal()}
            {renderFilterModal()}
        </View>
    );
}

/**
 * Capitalizes first letter of a word (e.g. "priority" → "Priority")
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    board: { flexDirection: 'row', paddingHorizontal: 10 },
    topBar: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    modalContent: { flex: 1, padding: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    filterOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBox: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterLabel: {
        marginTop: 10,
        marginBottom: 4,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});
