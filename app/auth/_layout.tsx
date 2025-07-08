import { Stack } from 'expo-router'
import React from 'react'

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{ headerShown: false }}
			initialRouteName='welcome'
		>
			<Stack.Screen name='welcome' />
			<Stack.Screen name='login' />
			<Stack.Screen name='signup' />
		</Stack>
	)
}
