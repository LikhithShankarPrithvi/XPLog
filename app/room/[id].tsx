import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import {
	ActivityLog,
	mockActivityLogs,
	mockRooms,
	mockUsers,
	Task,
	User,
} from '@/data/mockData'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import {
	Alert,
	Dimensions,
	FlatList,
	Modal,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

const { width } = Dimensions.get('window')

export default function RoomScreen() {
	const { id } = useLocalSearchParams()
	const colorScheme = useColorScheme()
	const colors = Colors[colorScheme ?? 'light']

	const [showAddTaskModal, setShowAddTaskModal] = useState(false)
	const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false)
	const [selectedTask, setSelectedTask] = useState<Task | null>(null)
	const [taskTitle, setTaskTitle] = useState('')
	const [taskDescription, setTaskDescription] = useState('')
	const [taskXP, setTaskXP] = useState('')
	const [activeTab, setActiveTab] = useState<'tasks' | 'activity'>('tasks')

	// Find the current room
	const room = mockRooms.find(r => r.id === id)

	if (!room) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Room not found</ThemedText>
			</ThemedView>
		)
	}

	// Get room members
	const roomMembers = mockUsers.filter(user => room.members.includes(user.id))

	// Get room activity logs
	const roomActivityLogs = mockActivityLogs
		.filter(log => log.roomId === room.id)
		.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() -
				new Date(a.timestamp).getTime()
		)

	// Handle task creation
	const handleAddTask = () => {
		if (!taskTitle.trim() || !taskDescription.trim() || !taskXP.trim()) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		const xpNumber = parseInt(taskXP)
		if (isNaN(xpNumber) || xpNumber <= 0) {
			Alert.alert('Error', 'Please enter a valid XP amount')
			return
		}

		// In a real app, you'd add this to your state management
		Alert.alert('Success', 'Task created successfully!')
		setShowAddTaskModal(false)
		setTaskTitle('')
		setTaskDescription('')
		setTaskXP('')
	}

	// Handle task claiming
	const handleClaimTask = (task: Task) => {
		if (task.status === 'available') {
			Alert.alert(
				'Success',
				`You claimed "${task.title}" for ${task.xpReward} XP!`
			)
			// In a real app, you'd update the task status
		}
	}

	// Handle task click
	const handleTaskClick = (task: Task) => {
		setSelectedTask(task)
		setShowTaskDetailsModal(true)
	}

	// Get user by ID
	const getUserById = (userId: string): User | undefined => {
		return mockUsers.find(user => user.id === userId)
	}

	// Format date
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		})
	}

	// Render task item
	const renderTaskItem = ({ item: task }: { item: Task }) => {
		const creator = getUserById(task.createdBy)
		const claimedBy = task.claimedBy ? getUserById(task.claimedBy) : null

		return (
			<TouchableOpacity
				style={[
					styles.taskCard,
					{ backgroundColor: colors.background },
					task.status === 'completed' && styles.completedTask,
				]}
				onPress={() => handleTaskClick(task)}
			>
				<ThemedView style={styles.taskHeader}>
					<ThemedText style={styles.taskTitle}>
						{task.title}
					</ThemedText>
					<ThemedView style={styles.taskXP}>
						<ThemedText style={styles.xpText}>
							+{task.xpReward} XP
						</ThemedText>
					</ThemedView>
				</ThemedView>

				<ThemedText style={styles.taskDescription} numberOfLines={2}>
					{task.description}
				</ThemedText>

				<ThemedView style={styles.taskFooter}>
					<ThemedView style={styles.taskInfo}>
						<ThemedText style={styles.taskCreator}>
							By {creator?.displayName || 'Unknown'}
						</ThemedText>
						<ThemedText style={styles.taskDate}>
							{formatDate(task.createdAt)}
						</ThemedText>
					</ThemedView>

					<ThemedView style={styles.taskActions}>
						{task.status === 'available' && (
							<TouchableOpacity
								style={styles.claimButton}
								onPress={() => handleClaimTask(task)}
							>
								<ThemedText style={styles.claimButtonText}>
									Claim
								</ThemedText>
							</TouchableOpacity>
						)}

						{task.status === 'claimed' && (
							<ThemedView style={styles.statusBadge}>
								<ThemedText style={styles.statusText}>
									Claimed by{' '}
									{claimedBy?.displayName || 'Unknown'}
								</ThemedText>
							</ThemedView>
						)}

						{task.status === 'completed' && (
							<ThemedView
								style={[
									styles.statusBadge,
									styles.completedBadge,
								]}
							>
								<ThemedText style={styles.statusText}>
									✓ Completed
								</ThemedText>
							</ThemedView>
						)}
					</ThemedView>
				</ThemedView>
			</TouchableOpacity>
		)
	}

	// Render activity log item
	const renderActivityItem = ({ item: log }: { item: ActivityLog }) => {
		const getActivityIcon = (type: string) => {
			switch (type) {
				case 'task_added':
					return '➕'
				case 'task_claimed':
					return '🎯'
				case 'task_completed':
					return '✅'
				case 'user_joined':
					return '👋'
				default:
					return '📝'
			}
		}

		return (
			<ThemedView style={styles.activityItem}>
				<ThemedText style={styles.activityIcon}>
					{getActivityIcon(log.type)}
				</ThemedText>
				<ThemedView style={styles.activityContent}>
					<ThemedText style={styles.activityText}>
						<ThemedText style={styles.activityUser}>
							{log.userName}
						</ThemedText>{' '}
						{log.message}
					</ThemedText>
					<ThemedText style={styles.activityTime}>
						{formatDate(log.timestamp)}
					</ThemedText>
				</ThemedView>
				{log.xpGained && (
					<ThemedView style={styles.activityXP}>
						<ThemedText style={styles.activityXPText}>
							+{log.xpGained} XP
						</ThemedText>
					</ThemedView>
				)}
			</ThemedView>
		)
	}

	return (
		<ThemedView style={styles.container}>
			{/* Header */}
			<ThemedView style={styles.header}>
				<ThemedView style={styles.headerLeft}>
					<ThemedText type='title' style={styles.roomTitle}>
						{room.name}
					</ThemedText>
					<ThemedText style={styles.roomCode}>
						#{room.code}
					</ThemedText>
				</ThemedView>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowAddTaskModal(true)}
				>
					<ThemedText style={styles.addButtonText}>
						+ Add Task
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>

			{/* Room Stats */}
			<ThemedView style={styles.statsContainer}>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{room.members.length}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Members</ThemedText>
				</ThemedView>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{
							room.tasks.filter(t => t.status === 'available')
								.length
						}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Available</ThemedText>
				</ThemedView>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{
							room.tasks.filter(t => t.status === 'completed')
								.length
						}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Completed</ThemedText>
				</ThemedView>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{room.tasks.reduce(
							(sum, task) => sum + task.xpReward,
							0
						)}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Total XP</ThemedText>
				</ThemedView>
			</ThemedView>

			{/* Members */}
			<ThemedView style={styles.membersContainer}>
				<ThemedText style={styles.sectionTitle}>Members</ThemedText>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{roomMembers.map(member => (
						<ThemedView key={member.id} style={styles.memberItem}>
							<ThemedText style={styles.memberAvatar}>
								{member.avatar || '👤'}
							</ThemedText>
							<ThemedText
								style={styles.memberName}
								numberOfLines={1}
							>
								{member.displayName}
							</ThemedText>
							<ThemedText style={styles.memberLevel}>
								Lv.{member.level}
							</ThemedText>
						</ThemedView>
					))}
				</ScrollView>
			</ThemedView>

			{/* Tabs */}
			<ThemedView style={styles.tabsContainer}>
				<TouchableOpacity
					style={[
						styles.tab,
						activeTab === 'tasks' && {
							backgroundColor: colors.tint,
						},
					]}
					onPress={() => setActiveTab('tasks')}
				>
					<ThemedText
						style={[
							styles.tabText,
							activeTab === 'tasks' && { color: 'white' },
						]}
					>
						Tasks ({room.tasks.length})
					</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						activeTab === 'activity' && {
							backgroundColor: colors.tint,
						},
					]}
					onPress={() => setActiveTab('activity')}
				>
					<ThemedText
						style={[
							styles.tabText,
							activeTab === 'activity' && { color: 'white' },
						]}
					>
						Activity
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>

			{/* Content */}
			<ThemedView style={styles.content}>
				{activeTab === 'tasks' ? (
					<FlatList
						data={room.tasks}
						renderItem={renderTaskItem}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.tasksList}
					/>
				) : (
					<FlatList
						data={roomActivityLogs}
						renderItem={renderActivityItem}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.activityList}
					/>
				)}
			</ThemedView>

			{/* Add Task Modal */}
			<Modal
				visible={showAddTaskModal}
				transparent
				animationType='slide'
				onRequestClose={() => setShowAddTaskModal(false)}
			>
				<View style={styles.modalOverlay}>
					<ThemedView style={styles.modalContainer}>
						<ThemedText style={styles.modalTitle}>
							Add New Task
						</ThemedText>

						<TextInput
							style={[styles.input, { color: colors.text }]}
							placeholder='Task title'
							placeholderTextColor={colors.text + '80'}
							value={taskTitle}
							onChangeText={setTaskTitle}
						/>

						<TextInput
							style={[
								styles.input,
								styles.textArea,
								{ color: colors.text },
							]}
							placeholder='Task description'
							placeholderTextColor={colors.text + '80'}
							value={taskDescription}
							onChangeText={setTaskDescription}
							multiline
							numberOfLines={4}
						/>

						<TextInput
							style={[styles.input, { color: colors.text }]}
							placeholder='XP reward'
							placeholderTextColor={colors.text + '80'}
							value={taskXP}
							onChangeText={setTaskXP}
							keyboardType='numeric'
						/>

						<ThemedView style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.cancelButton,
								]}
								onPress={() => setShowAddTaskModal(false)}
							>
								<ThemedText style={styles.cancelButtonText}>
									Cancel
								</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.createButton,
								]}
								onPress={handleAddTask}
							>
								<ThemedText style={styles.createButtonText}>
									Create
								</ThemedText>
							</TouchableOpacity>
						</ThemedView>
					</ThemedView>
				</View>
			</Modal>

			{/* Task Details Modal */}
			<Modal
				visible={showTaskDetailsModal}
				transparent
				animationType='slide'
				onRequestClose={() => setShowTaskDetailsModal(false)}
			>
				<View style={styles.modalOverlay}>
					<ThemedView style={styles.modalContainer}>
						{selectedTask && (
							<>
								<ThemedText style={styles.modalTitle}>
									Task Details
								</ThemedText>

								<ThemedText style={styles.detailTitle}>
									{selectedTask.title}
								</ThemedText>

								<ThemedText style={styles.detailDescription}>
									{selectedTask.description}
								</ThemedText>

								<ThemedView style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										XP Reward:
									</ThemedText>
									<ThemedText style={styles.detailValue}>
										+{selectedTask.xpReward} XP
									</ThemedText>
								</ThemedView>

								<ThemedView style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Status:
									</ThemedText>
									<ThemedText style={styles.detailValue}>
										{selectedTask.status}
									</ThemedText>
								</ThemedView>

								<ThemedView style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Created:
									</ThemedText>
									<ThemedText style={styles.detailValue}>
										{formatDate(selectedTask.createdAt)}
									</ThemedText>
								</ThemedView>

								<ThemedView style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Created by:
									</ThemedText>
									<ThemedText style={styles.detailValue}>
										{getUserById(selectedTask.createdBy)
											?.displayName || 'Unknown'}
									</ThemedText>
								</ThemedView>

								{selectedTask.claimedBy && (
									<ThemedView style={styles.detailRow}>
										<ThemedText style={styles.detailLabel}>
											Claimed by:
										</ThemedText>
										<ThemedText style={styles.detailValue}>
											{getUserById(selectedTask.claimedBy)
												?.displayName || 'Unknown'}
										</ThemedText>
									</ThemedView>
								)}

								{selectedTask.completedAt && (
									<ThemedView style={styles.detailRow}>
										<ThemedText style={styles.detailLabel}>
											Completed:
										</ThemedText>
										<ThemedText style={styles.detailValue}>
											{formatDate(
												selectedTask.completedAt
											)}
										</ThemedText>
									</ThemedView>
								)}

								<ThemedView style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.modalButton,
											styles.cancelButton,
										]}
										onPress={() =>
											setShowTaskDetailsModal(false)
										}
									>
										<ThemedText
											style={styles.cancelButtonText}
										>
											Close
										</ThemedText>
									</TouchableOpacity>
									{selectedTask.status === 'available' && (
										<TouchableOpacity
											style={[
												styles.modalButton,
												styles.createButton,
											]}
											onPress={() => {
												handleClaimTask(selectedTask)
												setShowTaskDetailsModal(false)
											}}
										>
											<ThemedText
												style={styles.createButtonText}
											>
												Claim
											</ThemedText>
										</TouchableOpacity>
									)}
								</ThemedView>
							</>
						)}
					</ThemedView>
				</View>
			</Modal>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 20,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	headerLeft: {
		flex: 1,
	},
	roomTitle: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	roomCode: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4,
	},
	addButton: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	addButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 20,
		backgroundColor: '#fff',
		marginBottom: 10,
	},
	statItem: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#4CAF50',
	},
	statLabel: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 4,
	},
	membersContainer: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: '#fff',
		marginBottom: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	memberItem: {
		alignItems: 'center',
		marginRight: 16,
		width: 60,
	},
	memberAvatar: {
		fontSize: 24,
		marginBottom: 4,
	},
	memberName: {
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'center',
	},
	memberLevel: {
		fontSize: 11,
		opacity: 0.7,
		marginTop: 2,
	},
	tabsContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		alignItems: 'center',
		marginHorizontal: 5,
		backgroundColor: '#f0f0f0',
	},
	tabText: {
		fontWeight: '600',
	},
	content: {
		flex: 1,
	},
	tasksList: {
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	taskCard: {
		padding: 16,
		marginBottom: 12,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	completedTask: {
		opacity: 0.7,
	},
	taskHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		flex: 1,
		marginRight: 10,
	},
	taskXP: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	xpText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
	taskDescription: {
		fontSize: 14,
		opacity: 0.8,
		marginBottom: 12,
		lineHeight: 20,
	},
	taskFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	taskInfo: {
		flex: 1,
	},
	taskCreator: {
		fontSize: 12,
		fontWeight: '600',
	},
	taskDate: {
		fontSize: 11,
		opacity: 0.6,
		marginTop: 2,
	},
	taskActions: {
		alignItems: 'flex-end',
	},
	claimButton: {
		backgroundColor: '#2196F3',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15,
	},
	claimButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 'bold',
	},
	statusBadge: {
		backgroundColor: '#FF9800',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 10,
	},
	completedBadge: {
		backgroundColor: '#4CAF50',
	},
	statusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: 'bold',
	},
	activityList: {
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	activityItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		marginBottom: 8,
		backgroundColor: '#fff',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	activityIcon: {
		fontSize: 20,
		marginRight: 12,
	},
	activityContent: {
		flex: 1,
	},
	activityText: {
		fontSize: 14,
		lineHeight: 20,
	},
	activityUser: {
		fontWeight: 'bold',
	},
	activityTime: {
		fontSize: 12,
		opacity: 0.6,
		marginTop: 2,
	},
	activityXP: {
		backgroundColor: '#4CAF50',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 10,
	},
	activityXPText: {
		color: 'white',
		fontSize: 11,
		fontWeight: 'bold',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: width * 0.9,
		maxWidth: 400,
		padding: 20,
		borderRadius: 20,
		maxHeight: '80%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 16,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	modalButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 10,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	cancelButton: {
		backgroundColor: '#f0f0f0',
	},
	createButton: {
		backgroundColor: '#4CAF50',
	},
	cancelButtonText: {
		color: '#333',
		fontWeight: 'bold',
	},
	createButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	detailTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	detailDescription: {
		fontSize: 14,
		opacity: 0.8,
		marginBottom: 20,
		lineHeight: 20,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	detailLabel: {
		fontSize: 14,
		fontWeight: '600',
	},
	detailValue: {
		fontSize: 14,
		opacity: 0.8,
	},
})
