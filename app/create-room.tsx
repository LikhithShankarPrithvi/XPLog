import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function CreateRoomScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type='title'>Create Room</ThemedText>
			<ThemedText>Create room form will go here</ThemedText>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
})
