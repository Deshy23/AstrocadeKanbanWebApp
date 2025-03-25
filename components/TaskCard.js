import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MAX_DESCRIPTION_PREVIEW_LENGTH, TEXT_WRAP_LENGTH, PRIORITY_COLORS } from '../utils/Constants';

/**
 * A single task card rendered in a column.
 * - Shows preview text or full wrapped text when selected
 * - Allows moving left/right between columns
 */
export default function TaskCard({ task, isSelected, onSelect, moveTask }) {
    const { name, description, assignee, date, priority } = task;

    /**
     * Wraps a long text string every N characters with a newline.
     * This is used to display the full task description in a readable format.
     */
    const wrapText = (text, maxCharsPerLine = TEXT_WRAP_LENGTH) =>
        text.replace(new RegExp(`(.{${maxCharsPerLine}})`, 'g'), '$1\n');

    /**
     * Returns the appropriate card background color based on priority.
     */
    const getCardColor = (priorityLevel) => {
        return PRIORITY_COLORS[priorityLevel] || PRIORITY_COLORS.Default;
    };

    /**
     * Returns the task description string to render based on selected state.
     */
    const renderDescription = () => {
        if (isSelected) return wrapText(description);
        return description.length > MAX_DESCRIPTION_PREVIEW_LENGTH
            ? description.slice(0, MAX_DESCRIPTION_PREVIEW_LENGTH) + '...'
            : description;
    };

    return (
        <TouchableOpacity
            onPress={onSelect}
            style={[styles.card, { backgroundColor: getCardColor(priority) }]}
        >
            <Text style={styles.name}>{name}</Text>
            <Text>{renderDescription()}</Text>
            <Text>{assignee}</Text>
            <Text>{date}</Text>

            {isSelected && (
                <View style={styles.arrowRow}>
                    <TouchableOpacity onPress={() => moveTask(task.id, 'left')}>
                        <Text style={styles.arrow}>◀️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => moveTask(task.id, 'right')}>
                        <Text style={styles.arrow}>▶️</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    arrowRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    arrow: {
        fontSize: 24,
        paddingHorizontal: 10,
    },
});
