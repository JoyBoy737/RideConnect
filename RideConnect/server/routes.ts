import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTourSchema, insertChatMessageSchema, insertCommunityPostSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  tourId?: string;
  userId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocketClient) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join_tour_chat':
            ws.tourId = data.tourId;
            ws.userId = data.userId;
            
            // Verify user is a member of the tour
            const isMember = await storage.isTourMember(data.tourId, data.userId);
            if (!isMember) {
              ws.send(JSON.stringify({ type: 'error', message: 'Not a member of this tour' }));
              return;
            }
            
            ws.send(JSON.stringify({ type: 'joined_chat', tourId: data.tourId }));
            break;
            
          case 'send_message':
            if (!ws.tourId || !ws.userId) {
              ws.send(JSON.stringify({ type: 'error', message: 'Not joined to any tour chat' }));
              return;
            }
            
            const newMessage = await storage.createChatMessage({
              tourId: ws.tourId,
              userId: ws.userId,
              message: data.message,
            });
            
            // Broadcast to all clients in the same tour
            wss.clients.forEach((client: WebSocketClient) => {
              if (client.tourId === ws.tourId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'new_message',
                  message: newMessage,
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Mock user for development (replace with proper authentication)
  const mockUser = {
    id: 'user-1',
    username: 'alex_rider',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex@example.com',
    toursJoined: 12,
    milesTraveled: 2450,
    photosShared: 85,
  };

  // Ensure mock user exists
  try {
    const existingUser = await storage.getUserByUsername(mockUser.username);
    if (!existingUser) {
      await storage.createUser({
        username: mockUser.username,
        password: 'password123',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      });
    }
  } catch (error) {
    console.log('Mock user setup:', error);
  }

  // API Routes
  app.get('/api/user', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user' });
    }
  });

  app.get('/api/tours', async (req, res) => {
    try {
      const tours = await storage.getTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get tours' });
    }
  });

  app.get('/api/tours/:id', async (req, res) => {
    try {
      const tour = await storage.getTour(req.params.id);
      if (!tour) {
        return res.status(404).json({ message: 'Tour not found' });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get tour' });
    }
  });

  app.post('/api/tours', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const tourData = insertTourSchema.parse(req.body);
      const tour = await storage.createTour(tourData, user.id);
      res.json(tour);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid tour data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create tour' });
    }
  });

  app.post('/api/tours/:id/join', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const isMember = await storage.isTourMember(req.params.id, user.id);
      if (isMember) {
        return res.status(400).json({ message: 'Already a member of this tour' });
      }

      const membership = await storage.joinTour(req.params.id, user.id);
      res.json(membership);
    } catch (error) {
      res.status(500).json({ message: 'Failed to join tour' });
    }
  });

  app.delete('/api/tours/:id/leave', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      await storage.leaveTour(req.params.id, user.id);
      res.json({ message: 'Left tour successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to leave tour' });
    }
  });

  app.get('/api/tours/:id/messages', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const isMember = await storage.isTourMember(req.params.id, user.id);
      if (!isMember) {
        return res.status(403).json({ message: 'Not a member of this tour' });
      }

      const messages = await storage.getChatMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get messages' });
    }
  });

  app.get('/api/community-posts', async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get community posts' });
    }
  });

  app.post('/api/community-posts', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(mockUser.username);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const postData = insertCommunityPostSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const post = await storage.createCommunityPost(postData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid post data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create post' });
    }
  });

  return httpServer;
}
