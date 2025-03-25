/**
 * Simulates fetching tasks from a mock backend.
 * Generates a fixed number of tasks with varied statuses, priorities, and long descriptions.
 */

export const fetchTasks = async (count = 20) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const statuses = ['todo', 'doing', 'review', 'done'];
            const longText =
                'This is a long description used to test truncation and line wrapping in the task cards. ' +
                'It includes various details about the task, repeated for clarity and length. '.repeat(3); // ~300 chars

            const tasks = Array.from({ length: count }, (_, i) => ({
                id: `task-${i}`,
                name: `Task ${i + 1}`,
                description: `${longText} [Note ${i}]`,
                date: new Date(Date.now() + i * 10000000).toISOString(),
                priority: ['Low', 'Medium', 'High'][i % 3],
                assignee: `User ${i % 5}`,
                status: statuses[i % 4],
            }));

            resolve(tasks);
        }, 1000); // simulate network delay
    });
};

/**
 * Stub function to simulate writing to a backend.
 * You can expand this later for real API integration.
 */
export const writeTasks = () => {
    // No-op for now; would update server or local DB
};