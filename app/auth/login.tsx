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
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

export default function LoginScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const colorScheme = useColorScheme()
	const colors = Colors[colorScheme ?? 'light']

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		setIsLoading(true)

		// Simulate API call - Replace with real authentication later
		setTimeout(() => {
			setIsLoading(false)
			Alert.alert('Success', 'Login successful!', [
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
					<ThemedText style={styles.title}>Welcome Back!</ThemedText>
					<ThemedText style={styles.subtitle}>
						Sign in to continue your XP journey
					</ThemedText>
				</View>

				{/* Form */}
				<View style={styles.form}>
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
							placeholder='Enter your password'
							placeholderTextColor='#666'
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<TouchableOpacity
						style={[
							styles.loginButton,
							isLoading && styles.loginButtonDisabled,
						]}
						onPress={handleLogin}
						disabled={isLoading}
					>
						<ThemedText style={styles.loginButtonText}>
							{isLoading ? 'Signing In...' : 'Sign In'}
						</ThemedText>
					</TouchableOpacity>

					<View style={styles.footer}>
						<ThemedText style={styles.footerText}>
							Don't have an account?{' '}
						</ThemedText>
						<TouchableOpacity
							onPress={() => router.push('./signup')}
						>
							<ThemedText style={styles.footerLink}>
								Sign Up
							</ThemedText>
						</TouchableOpacity>
					</View>
				</View>
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
		marginBottom: 40,
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
		gap: 20,
	},
	inputContainer: {
		gap: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
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
	loginButton: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	loginButtonDisabled: {
		opacity: 0.6,
	},
	loginButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#2e7d32',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
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
