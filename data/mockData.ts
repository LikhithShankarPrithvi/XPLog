// Mock Data for XP Tracker App Development

export interface User {
	id: string
	email: string
	displayName: string
	avatar?: string
	totalXP: number
	level: number
	rooms: string[]
}

export interface Room {
	id: string
	name: string
	code: string
	createdBy: string
	members: string[]
	tasks: Task[]
	createdAt: Date
}

export interface Task {
	id: string
	title: string
	description: string
	xpReward: number
	createdBy: string
	claimedBy?: string
	status: 'available' | 'claimed' | 'completed'
	createdAt: Date
	completedAt?: Date
}

export interface ActivityLog {
	id: string
	roomId: string
	userId: string
	userName: string
	type: 'task_added' | 'task_claimed' | 'task_completed' | 'user_joined'
	message: string
	xpGained?: number
	timestamp: Date
}

// Mock Users
export const mockUsers: User[] = [
	{
		id: '1',
		email: 'john@example.com',
		displayName: 'Shaun Lee',
		avatar: '🧑‍💻',
		totalXP: 1250,
		level: 5,
		rooms: ['room1', 'room2'],
	},
	{
		id: '2',
		email: 'jane@example.com',
		displayName: 'Clark Kent',
		avatar: '👩‍🎨',
		totalXP: 890,
		level: 4,
		rooms: ['room1'],
	},
	{
		id: '3',
		email: 'alex@example.com',
		displayName: 'Bruce Wayne',
		avatar: '👨‍🔬',
		totalXP: 2150,
		level: 8,
		rooms: ['room1', 'room2'],
	},
]

// Mock Tasks
export const mockTasks: Task[] = [
	{
		id: 'task1',
		title: 'Complete React Native Tutorial',
		description:
			'Finish the advanced React Native course and submit the final project',
		xpReward: 100,
		createdBy: '1',
		status: 'available',
		createdAt: new Date('2024-01-15T10:00:00Z'),
	},
	{
		id: 'task2',
		title: 'Review Team Code',
		description: 'Review and provide feedback on the latest pull requests',
		xpReward: 50,
		createdBy: '2',
		claimedBy: '1',
		status: 'claimed',
		createdAt: new Date('2024-01-15T14:30:00Z'),
	},
	{
		id: 'task3',
		title: 'Write Unit Tests',
		description:
			'Add comprehensive unit tests for the authentication module',
		xpReward: 75,
		createdBy: '3',
		claimedBy: '2',
		status: 'completed',
		createdAt: new Date('2024-01-14T09:15:00Z'),
		completedAt: new Date('2024-01-15T16:45:00Z'),
	},
	{
		id: 'task4',
		title: 'Design System Documentation',
		description:
			'Create comprehensive documentation for the design system components',
		xpReward: 125,
		createdBy: '1',
		status: 'available',
		createdAt: new Date('2024-01-15T11:20:00Z'),
	},
	{
		id: 'task5',
		title: 'Database Optimization',
		description: 'Optimize database queries for better performance',
		xpReward: 150,
		createdBy: '3',
		claimedBy: '3',
		status: 'claimed',
		createdAt: new Date('2024-01-15T13:10:00Z'),
	},
]

// Mock Rooms
export const mockRooms: Room[] = [
	{
		id: 'room1',
		name: 'Development Team',
		code: 'DEV123',
		createdBy: '1',
		members: ['1', '2', '3'],
		tasks: mockTasks.filter(task =>
			['task1', 'task2', 'task3'].includes(task.id)
		),
		createdAt: new Date('2024-01-10T08:00:00Z'),
	},
	{
		id: 'room2',
		name: 'Design Squad',
		code: 'DSN456',
		createdBy: '2',
		members: ['1', '3'],
		tasks: mockTasks.filter(task => ['task4', 'task5'].includes(task.id)),
		createdAt: new Date('2024-01-12T10:30:00Z'),
	},
]

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
	{
		id: 'log1',
		roomId: 'room1',
		userId: '2',
		userName: 'Jane Smith',
		type: 'task_completed',
		message: 'completed "Write Unit Tests"',
		xpGained: 75,
		timestamp: new Date('2024-01-15T16:45:00Z'),
	},
	{
		id: 'log2',
		roomId: 'room1',
		userId: '1',
		userName: 'Shaun Lee',
		type: 'task_claimed',
		message: 'claimed "Review Team Code"',
		timestamp: new Date('2024-01-15T15:20:00Z'),
	},
	{
		id: 'log3',
		roomId: 'room2',
		userId: '3',
		userName: 'Alex Johnson',
		type: 'task_claimed',
		message: 'claimed "Database Optimization"',
		timestamp: new Date('2024-01-15T13:10:00Z'),
	},
	{
		id: 'log4',
		roomId: 'room1',
		userId: '1',
		userName: 'Shaun Lee',
		type: 'task_added',
		message: 'added "Complete React Native Tutorial"',
		timestamp: new Date('2024-01-15T10:00:00Z'),
	},
	{
		id: 'log5',
		roomId: 'room2',
		userId: '3',
		userName: 'Alex Johnson',
		type: 'user_joined',
		message: 'joined the room',
		timestamp: new Date('2024-01-12T11:15:00Z'),
	},
]

// Current logged in user (for development)
export const currentUser: User = mockUsers[0]

// Helper functions
export const getUserById = (id: string): User | undefined =>
	mockUsers.find(user => user.id === id)

export const getRoomById = (id: string): Room | undefined =>
	mockRooms.find(room => room.id === id)

export const getTaskById = (id: string): Task | undefined =>
	mockTasks.find(task => task.id === id)

export const getActivityLogsForRoom = (roomId: string): ActivityLog[] =>
	mockActivityLogs.filter(log => log.roomId === roomId)

export const calculateLevel = (xp: number): number => {
	// Level progression: 100 XP per level for simplicity
	return Math.floor(xp / 100) + 1
}

export const getXPForNextLevel = (currentXP: number): number => {
	const currentLevel = calculateLevel(currentXP)
	return currentLevel * 100
}

export const getXPProgress = (currentXP: number): number => {
	const currentLevel = calculateLevel(currentXP)
	const xpForCurrentLevel = (currentLevel - 1) * 100
	const xpForNextLevel = currentLevel * 100
	const progress =
		(currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)
	return Math.max(0, Math.min(1, progress))
}
