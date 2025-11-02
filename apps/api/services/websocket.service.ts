import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

export class WebSocketService {
    private io: SocketIOServer;
    private static instance: WebSocketService;

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    public static getInstance(server?: HTTPServer): WebSocketService {
        if (!WebSocketService.instance && server) {
            WebSocketService.instance = new WebSocketService(server);
        }
        return WebSocketService.instance;
    }

    private setupMiddleware() {
        // Authentication middleware
        this.io.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }

                if (!process.env.JWT_SECRET) {
                    return next(new Error('Authentication error: Server configuration error'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
                socket.data.userId = decoded.id;
                socket.data.user = decoded;

                next();
            } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                    next(new Error('Authentication error: Token expired'));
                } else if (error.name === 'JsonWebTokenError') {
                    next(new Error('Authentication error: Invalid token format'));
                } else {
                    next(new Error('Authentication error: Invalid token'));
                }
            }
        });
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            const userId = socket.data.userId;

            // Join user to their personal room for targeted updates
            socket.join(`user_${userId}`);

            // Handle disconnection
            socket.on('disconnect', () => {
                // Connection cleanup handled automatically
            });

            // Handle joining specific rooms
            socket.on('join_dashboard', () => {
                socket.join(`dashboard_${userId}`);
            });

            socket.on('join_invoice_list', () => {
                socket.join(`invoice_list_${userId}`);
            });

            socket.on('leave_dashboard', () => {
                socket.leave(`dashboard_${userId}`);
            });

            socket.on('leave_invoice_list', () => {
                socket.leave(`invoice_list_${userId}`);
            });
        });
    }

    public emitInvoiceCreated(userId: number, invoice: any) {
        const notification = {
            type: 'INVOICE_CREATED',
            invoiceId: invoice.id,
            timestamp: new Date().toISOString()
        };

        this.io.to(`user_${userId}`).emit('invoice_notification', notification);
        this.io.to(`dashboard_${userId}`).emit('dashboard_notification', notification);
        this.io.to(`invoice_list_${userId}`).emit('invoice_list_notification', notification);
    }

    public emitInvoiceStatusUpdated(userId: number, invoiceId: number, status: string) {
        const notification = {
            type: 'INVOICE_STATUS_UPDATED',
            invoiceId: invoiceId,
            status: status,
            timestamp: new Date().toISOString()
        };

        this.io.to(`user_${userId}`).emit('invoice_notification', notification);
        this.io.to(`dashboard_${userId}`).emit('dashboard_notification', notification);
        this.io.to(`invoice_list_${userId}`).emit('invoice_list_notification', notification);
    }

    public emitInvoiceUpdated(userId: number, invoice: any) {
        const notification = {
            type: 'INVOICE_UPDATED',
            invoiceId: invoice.id,
            timestamp: new Date().toISOString()
        };

        this.io.to(`user_${userId}`).emit('invoice_notification', notification);
        this.io.to(`dashboard_${userId}`).emit('dashboard_notification', notification);
        this.io.to(`invoice_list_${userId}`).emit('invoice_list_notification', notification);
    }

    // Emit invoice deleted to user
    public emitInvoiceDeleted(userId: number, invoiceId: number) {
        const updateData = {
            type: 'INVOICE_DELETED',
            data: { id: invoiceId },
            timestamp: new Date().toISOString()
        };

        this.io.to(`user_${userId}`).emit('invoice_deleted', updateData);
        this.io.to(`dashboard_${userId}`).emit('dashboard_update', updateData);
        this.io.to(`invoice_list_${userId}`).emit('invoice_list_update', updateData);
    }

    // Get Socket.IO instance for direct use if needed
    public getIO(): SocketIOServer {
        return this.io;
    }
}

export const getWebSocketService = (server?: HTTPServer) => {
    return WebSocketService.getInstance(server);
};