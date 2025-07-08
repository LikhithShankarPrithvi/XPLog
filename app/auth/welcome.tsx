import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window')

export default function WelcomeScreen() {
	const colorScheme = useColorScheme()
	const colors = Colors[colorScheme ?? 'light']

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={
					colorScheme === 'dark'
						? ['#1a1a2e', '#16213e', '#0f3460']
						: ['#4CAF50', '#45a049', '#2e7d32']
				}
				style={styles.gradient}
			>
				{/* Header Section */}
				<View style={styles.headerContainer}>
					<ThemedText style={styles.emoji}>🎯</ThemedText>
					<ThemedText style={styles.title}>XP Tracker</ThemedText>
					<ThemedText style={styles.subtitle}>
						Gamify your productivity with friends!
					</ThemedText>
				</View>

				{/* Features Section */}
				<View style={styles.featuresContainer}>
					<View style={styles.featureItem}>
						<ThemedText style={styles.featureEmoji}>🏆</ThemedText>
						<ThemedText style={styles.featureText}>
							Compete with friends
						</ThemedText>
					</View>
					<View style={styles.featureItem}>
						<ThemedText style={styles.featureEmoji}>⚡</ThemedText>
						<ThemedText style={styles.featureText}>
							Earn XP for tasks
						</ThemedText>
					</View>
					<View style={styles.featureItem}>
						<ThemedText style={styles.featureEmoji}>🎮</ThemedText>
						<ThemedText style={styles.featureText}>
							Level up together
						</ThemedText>
					</View>
				</View>

				{/* Buttons Section */}
				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						style={[styles.button, styles.primaryButton]}
						onPress={() => router.push('./signup')}
					>
						<ThemedText style={styles.primaryButtonText}>
							Get Started
						</ThemedText>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.secondaryButton]}
						onPress={() => router.push('./login')}
					>
						<ThemedText style={styles.secondaryButtonText}>
							I already have an account
						</ThemedText>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 60,
		paddingBottom: 40,
	},
	headerContainer: {
		alignItems: 'center',
		marginTop: 60,
		marginBottom: 80,
	},
	emoji: {
		fontSize: 80,
		marginBottom: 20,
	},
	title: {
		fontSize: 42,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 12,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		color: '#FFFFFF',
		textAlign: 'center',
		opacity: 0.9,
	},
	featuresContainer: {
		flex: 1,
		justifyContent: 'center',
		gap: 32,
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.2)',
	},
	featureEmoji: {
		fontSize: 28,
		marginRight: 16,
	},
	featureText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	buttonsContainer: {
		gap: 16,
		marginTop: 40,
	},
	button: {
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 16,
		alignItems: 'center',
	},
	primaryButton: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	primaryButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#2e7d32',
	},
	secondaryButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.4)',
	},
	secondaryButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
})
