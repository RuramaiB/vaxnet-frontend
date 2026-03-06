import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from './useToast'

export const useNotification = () => {
    const { addToast } = useToast()
    const eventSource = ref(null)
    const isConnected = ref(false)

    const connect = (email) => {
        if (!email || eventSource.value) return

        console.log(`Connecting to notification stream for: ${email}`)
        const url = `http://localhost:8080/api/notifications/sse/${email}`

        eventSource.value = new EventSource(url)

        eventSource.value.addEventListener('connected', (event) => {
            console.log('Notification stream connected:', event.data)
            isConnected.value = true
        })

        eventSource.value.addEventListener('toast', (event) => {
            try {
                const data = JSON.parse(event.data)
                addToast(data.message, data.type || 'info', 8000)

                // Browser native notification if permission granted
                if (Notification.permission === 'granted') {
                    new Notification('VaxNet Reminder', {
                        body: data.message,
                        icon: '/favicon.ico'
                    })
                }
            } catch (e) {
                console.error('Failed to parse toast data:', e)
            }
        })

        eventSource.value.onerror = (error) => {
            console.error('SSE Error:', error)
            isConnected.value = false
            eventSource.value.close()
            eventSource.value = null

            // Retry after 5 seconds
            setTimeout(() => connect(email), 5000)
        }
    }

    const disconnect = () => {
        if (eventSource.value) {
            eventSource.value.close()
            eventSource.value = null
            isConnected.value = false
        }
    }

    // Permission request
    const requestPermission = () => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission()
        }
    }

    return {
        connect,
        disconnect,
        isConnected,
        requestPermission
    }
}
