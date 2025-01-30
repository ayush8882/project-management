import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private readonly connectedClients = new Map<string, Socket> ();

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string
        if(userId) { this.connectedClients.set(userId, client)}
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string
        if(userId) { this.connectedClients.delete(userId)}
    }

    notifyTaskUpdates (task: any) {
        console.log('inside notification', task, task?.assigned_user?.toString())
        const client = this.connectedClients.get(task?.assigned_user?.toString())
        console.log(client)
        if(client){
            client?.emit('taskUpdated', {
                message: 'Notification from socket io that task has been updated',
                task_id: task?.id?.toString(),
                task_name: task?.name
            })
        }
    }
}