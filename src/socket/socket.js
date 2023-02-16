import { io } from 'socket.io-client'
import StorageHelper from '../utils/StorageHelper'

export default {
    connect(token, serverUrl = `${process.env.API_URL}`) {
        let authtoken = StorageHelper.getAuthKeyFromStorage()

        const socket = io(serverUrl, {
            auth: {
                token: authtoken,
            },
            reconnectionAttempts: 10,
            reconnectionDelay: 5000,
            reconnectionDelayMax: 5000,
        })
        console.log(serverUrl, 'socket..')
        return socket
    },

    disconnect() {
        this.client.end()
    },
}
