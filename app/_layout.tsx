import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	})

	// Mock authentication state (replace with real auth later)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	if (!loaded) {
		return null
	}

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<Stack screenOptions={{ headerShown: false }}>
				{!isAuthenticated ? (
					<Stack.Screen name='auth' />
				) : (
					<Stack.Screen name='(tabs)' />
				)}
				<Stack.Screen name='room/[id]' />
				<Stack.Screen name='create-room' />
				<Stack.Screen name='join-room' />
				<Stack.Screen name='+not-found' />
			</Stack>
			<StatusBar style='auto' />
		</ThemeProvider>
	)
}
