import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { currentUser, getUserById, mockRooms } from '@/data/mockData'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

export default function HomeScreen() {
	const colorScheme = useColorScheme()
	const colors = Colors[colorScheme ?? 'light']

	const userRooms = mockRooms.filter(room =>
		room.members.includes(currentUser.id)
	)

	const renderRoomCard = ({ item: room }: { item: any }) => (
		<TouchableOpacity
			style={[styles.roomCard, { backgroundColor: colors.background }]}
			onPress={() => router.push(`/room/${room.id}` as any)}
		>
			<ThemedView style={styles.roomHeader}>
				<ThemedText type='subtitle' style={styles.roomName}>
					{room.name}
				</ThemedText>
				<ThemedText style={styles.roomCode}>#{room.code}</ThemedText>
			</ThemedView>

			<ThemedView style={styles.roomStats}>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{room.members.length}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Members</ThemedText>
				</ThemedView>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{room.tasks.length}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Tasks</ThemedText>
				</ThemedView>
				<ThemedView style={styles.statItem}>
					<ThemedText style={styles.statNumber}>
						{room.tasks.reduce(
							(sum: number, task: any) => sum + task.xpReward,
							0
						)}
					</ThemedText>
					<ThemedText style={styles.statLabel}>Total XP</ThemedText>
				</ThemedView>
			</ThemedView>

			<ThemedView style={styles.roomMembers}>
				{room.members.slice(0, 3).map((memberId: string) => {
					const member = getUserById(memberId)
					return (
						<ThemedText key={memberId} style={styles.memberEmoji}>
							{member?.avatar || '👤'}
						</ThemedText>
					)
				})}
				{room.members.length > 3 && (
					<ThemedText style={styles.moreMembers}>
						+{room.members.length - 3}
					</ThemedText>
				)}
			</ThemedView>
		</TouchableOpacity>
	)

	return (
		<ThemedView style={styles.container}>
			{/* Header */}
			<ThemedView style={styles.header}>
				<ThemedView style={styles.headerLeft}>
					<ThemedText type='title'>
						Hi, {currentUser.displayName.split(' ')[0]}! 👋
					</ThemedText>
					<ThemedText style={styles.headerSubtitle}>
						Level {currentUser.level} • {currentUser.totalXP} XP
					</ThemedText>
				</ThemedView>
				<ThemedView style={styles.headerRight}>
					<ThemedText style={styles.levelBadge}>
						Lv.{currentUser.level}
					</ThemedText>
				</ThemedView>
			</ThemedView>

			{/* XP Progress Bar */}
			<ThemedView style={styles.xpContainer}>
				<ThemedView style={styles.xpBar}>
					<ThemedView
						style={[
							styles.xpProgress,
							{
								width: `${
									((currentUser.totalXP % 100) / 100) * 100
								}%`,
								backgroundColor: colors.tint,
							},
						]}
					/>
				</ThemedView>
				<ThemedText style={styles.xpText}>
					{currentUser.totalXP % 100}/100 XP to next level
				</ThemedText>
			</ThemedView>

			{/* Action Buttons */}
			<ThemedView style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, styles.createButton]}
					onPress={() => router.push('/create-room')}
				>
					<ThemedText style={styles.actionButtonText}>
						➕ Create Room
					</ThemedText>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, styles.joinButton]}
					onPress={() => router.push('/join-room')}
				>
					<ThemedText style={styles.actionButtonText}>
						🚪 Join Room
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>

			{/* Rooms List */}
			<ThemedView style={styles.roomsSection}>
				<ThemedText type='subtitle' style={styles.sectionTitle}>
					Your Rooms ({userRooms.length})
				</ThemedText>

				{userRooms.length > 0 ? (
					<FlatList
						data={userRooms}
						renderItem={renderRoomCard}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.roomsList}
					/>
				) : (
					<ThemedView style={styles.emptyState}>
						<ThemedText style={styles.emptyStateEmoji}>
							🎯
						</ThemedText>
						<ThemedText style={styles.emptyStateTitle}>
							No rooms yet!
						</ThemedText>
						<ThemedText style={styles.emptyStateSubtitle}>
							Create or join a room to start earning XP with
							friends
						</ThemedText>
					</ThemedView>
				)}
			</ThemedView>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	headerLeft: {
		flex: 1,
	},
	headerSubtitle: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4,
	},
	headerRight: {
		alignItems: 'center',
	},
	levelBadge: {
		backgroundColor: '#4CAF50',
		color: '#FFFFFF',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		fontSize: 14,
		fontWeight: 'bold',
	},
	xpContainer: {
		marginBottom: 24,
	},
	xpBar: {
		height: 8,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		overflow: 'hidden',
		marginBottom: 8,
	},
	xpProgress: {
		height: '100%',
		borderRadius: 4,
	},
	xpText: {
		fontSize: 14,
		textAlign: 'center',
		opacity: 0.7,
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 24,
	},
	actionButton: {
		flex: 1,
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		alignItems: 'center',
	},
	createButton: {
		backgroundColor: '#4CAF50',
	},
	joinButton: {
		backgroundColor: '#2196F3',
	},
	actionButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	roomsSection: {
		flex: 1,
	},
	sectionTitle: {
		marginBottom: 16,
		fontSize: 20,
		fontWeight: 'bold',
	},
	roomsList: {
		paddingBottom: 20,
	},
	roomCard: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	roomHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	roomName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	roomCode: {
		fontSize: 14,
		opacity: 0.7,
		fontWeight: '600',
	},
	roomStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 12,
	},
	statItem: {
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#4CAF50',
	},
	statLabel: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 2,
	},
	roomMembers: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	memberEmoji: {
		fontSize: 24,
		marginRight: 8,
	},
	moreMembers: {
		fontSize: 14,
		opacity: 0.7,
		fontWeight: '600',
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 60,
	},
	emptyStateEmoji: {
		fontSize: 64,
		marginBottom: 16,
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	emptyStateSubtitle: {
		fontSize: 16,
		opacity: 0.7,
		textAlign: 'center',
		paddingHorizontal: 32,
	},
})
