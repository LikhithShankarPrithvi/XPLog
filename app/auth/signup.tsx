import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

export default function SignupScreen() {
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const colorScheme = useColorScheme()
	const colors = Colors[colorScheme ?? 'light']

	const handleSignup = async () => {
		if (!displayName || !email || !password || !confirmPassword) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match')
			return
		}

		if (password.length < 6) {
			Alert.alert('Error', 'Password must be at least 6 characters')
			return
		}

		setIsLoading(true)

		// Simulate API call - Replace with real authentication later
		setTimeout(() => {
			setIsLoading(false)
			Alert.alert('Success', 'Account created successfully!', [
				{ text: 'OK', onPress: () => router.replace('/(tabs)') },
			])
		}, 1000)
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<LinearGradient
				colors={
					colorScheme === 'dark'
						? ['#1a1a2e', '#16213e', '#0f3460']
						: ['#4CAF50', '#45a049', '#2e7d32']
				}
				style={styles.gradient}
			>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.back()}
					>
						<ThemedText style={styles.backButtonText}>
							← Back
						</ThemedText>
					</TouchableOpacity>
					<ThemedText style={styles.title}>
						Join XP Tracker!
					</ThemedText>
					<ThemedText style={styles.subtitle}>
						Create your account and start earning XP
					</ThemedText>
				</View>

				{/* Form */}
				<ScrollView
					style={styles.form}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>
							Display Name
						</ThemedText>
						<TextInput
							style={styles.input}
							placeholder='Enter your name'
							placeholderTextColor='#666'
							value={displayName}
							onChangeText={setDisplayName}
							autoCapitalize='words'
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Email</ThemedText>
						<TextInput
							style={styles.input}
							placeholder='Enter your email'
							placeholderTextColor='#666'
							value={email}
							onChangeText={setEmail}
							keyboardType='email-address'
							autoCapitalize='none'
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>Password</ThemedText>
						<TextInput
							style={styles.input}
							placeholder='Create a password'
							placeholderTextColor='#666'
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>
							Confirm Password
						</ThemedText>
						<TextInput
							style={styles.input}
							placeholder='Confirm your password'
							placeholderTextColor='#666'
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
						/>
					</View>

					<TouchableOpacity
						style={[
							styles.signupButton,
							isLoading && styles.signupButtonDisabled,
						]}
						onPress={handleSignup}
						disabled={isLoading}
					>
						<ThemedText style={styles.signupButtonText}>
							{isLoading
								? 'Creating Account...'
								: 'Create Account'}
						</ThemedText>
					</TouchableOpacity>

					<View style={styles.footer}>
						<ThemedText style={styles.footerText}>
							Already have an account?{' '}
						</ThemedText>
						<TouchableOpacity
							onPress={() => router.push('./login')}
						>
							<ThemedText style={styles.footerLink}>
								Sign In
							</ThemedText>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</LinearGradient>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 50,
	},
	header: {
		alignItems: 'center',
		marginBottom: 30,
	},
	backButton: {
		alignSelf: 'flex-start',
		paddingVertical: 8,
		paddingHorizontal: 4,
		marginBottom: 20,
	},
	backButtonText: {
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: '#FFFFFF',
		textAlign: 'center',
		opacity: 0.9,
	},
	form: {
		flex: 1,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 8,
	},
	input: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 12,
		fontSize: 16,
		color: '#333',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	signupButton: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	signupButtonDisabled: {
		opacity: 0.6,
	},
	signupButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#2e7d32',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
		flexWrap: 'wrap',
	},
	footerText: {
		fontSize: 16,
		color: '#FFFFFF',
		opacity: 0.9,
	},
	footerLink: {
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: 'bold',
		textDecorationLine: 'underline',
	},
})
