import { 
  users, 
  tours, 
  tourMemberships, 
  chatMessages, 
  communityPosts,
  type User, 
  type InsertUser,
  type Tour,
  type InsertTour,
  type TourMembership,
  type ChatMessage,
  type InsertChatMessage,
  type CommunityPost,
  type InsertCommunityPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: string, stats: { toursJoined?: number; milesTraveled?: number; photosShared?: number }): Promise<void>;

  // Tour methods
  getTours(): Promise<(Tour & { creator: User; memberCount: number })[]>;
  getTour(id: string): Promise<(Tour & { creator: User; members: (TourMembership & { user: User })[] }) | undefined>;
  createTour(tour: InsertTour, creatorId: string): Promise<Tour>;
  updateTour(id: string, updates: Partial<Tour>): Promise<Tour | undefined>;
  joinTour(tourId: string, userId: string): Promise<TourMembership>;
  leaveTour(tourId: string, userId: string): Promise<void>;
  getUserTours(userId: string): Promise<(Tour & { creator: User; memberCount: number })[]>;
  isTourMember(tourId: string, userId: string): Promise<boolean>;

  // Chat methods
  getChatMessages(tourId: string): Promise<(ChatMessage & { user: User })[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage & { user: User }>;

  // Community methods
  getCommunityPosts(): Promise<(CommunityPost & { user: User; tour?: Tour })[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStats(userId: string, stats: { toursJoined?: number; milesTraveled?: number; photosShared?: number }): Promise<void> {
    await db
      .update(users)
      .set(stats)
      .where(eq(users.id, userId));
  }

  async getTours(): Promise<(Tour & { creator: User; memberCount: number })[]> {
    const result = await db
      .select({
        tour: tours,
        creator: users,
        memberCount: sql<number>`count(${tourMemberships.id})::int`,
      })
      .from(tours)
      .leftJoin(users, eq(tours.createdBy, users.id))
      .leftJoin(tourMemberships, eq(tours.id, tourMemberships.tourId))
      .groupBy(tours.id, users.id)
      .orderBy(desc(tours.createdAt));

    return result.map(row => ({
      ...row.tour,
      creator: row.creator!,
      memberCount: row.memberCount || 0,
    }));
  }

  async getTour(id: string): Promise<(Tour & { creator: User; members: (TourMembership & { user: User })[] }) | undefined> {
    const [tourResult] = await db
      .select({
        tour: tours,
        creator: users,
      })
      .from(tours)
      .leftJoin(users, eq(tours.createdBy, users.id))
      .where(eq(tours.id, id));

    if (!tourResult) return undefined;

    const members = await db
      .select({
        membership: tourMemberships,
        user: users,
      })
      .from(tourMemberships)
      .leftJoin(users, eq(tourMemberships.userId, users.id))
      .where(eq(tourMemberships.tourId, id));

    return {
      ...tourResult.tour,
      creator: tourResult.creator!,
      members: members.map(m => ({
        ...m.membership,
        user: m.user!,
      })),
    };
  }

  async createTour(tour: InsertTour, creatorId: string): Promise<Tour> {
    const [newTour] = await db
      .insert(tours)
      .values({
        ...tour,
        createdBy: creatorId,
        currentParticipants: 1,
      })
      .returning();

    // Add creator as a member
    await db.insert(tourMemberships).values({
      tourId: newTour.id,
      userId: creatorId,
      role: 'creator',
    });

    return newTour;
  }

  async updateTour(id: string, updates: Partial<Tour>): Promise<Tour | undefined> {
    const [updated] = await db
      .update(tours)
      .set(updates)
      .where(eq(tours.id, id))
      .returning();
    return updated || undefined;
  }

  async joinTour(tourId: string, userId: string): Promise<TourMembership> {
    const [membership] = await db
      .insert(tourMemberships)
      .values({
        tourId,
        userId,
      })
      .returning();

    // Update tour participant count
    await db
      .update(tours)
      .set({
        currentParticipants: sql`${tours.currentParticipants} + 1`,
      })
      .where(eq(tours.id, tourId));

    return membership;
  }

  async leaveTour(tourId: string, userId: string): Promise<void> {
    await db
      .delete(tourMemberships)
      .where(and(
        eq(tourMemberships.tourId, tourId),
        eq(tourMemberships.userId, userId)
      ));

    // Update tour participant count
    await db
      .update(tours)
      .set({
        currentParticipants: sql`${tours.currentParticipants} - 1`,
      })
      .where(eq(tours.id, tourId));
  }

  async getUserTours(userId: string): Promise<(Tour & { creator: User; memberCount: number })[]> {
    const result = await db
      .select({
        tour: tours,
        creator: users,
        memberCount: sql<number>`count(tm2.id)::int`,
      })
      .from(tourMemberships)
      .leftJoin(tours, eq(tourMemberships.tourId, tours.id))
      .leftJoin(users, eq(tours.createdBy, users.id))
      .leftJoin(
        sql`${tourMemberships} tm2`,
        sql`${tours.id} = tm2.tour_id`
      )
      .where(eq(tourMemberships.userId, userId))
      .groupBy(tours.id, users.id)
      .orderBy(desc(tours.createdAt));

    return result.map(row => ({
      ...row.tour!,
      creator: row.creator!,
      memberCount: row.memberCount || 0,
    }));
  }

  async isTourMember(tourId: string, userId: string): Promise<boolean> {
    const [membership] = await db
      .select()
      .from(tourMemberships)
      .where(and(
        eq(tourMemberships.tourId, tourId),
        eq(tourMemberships.userId, userId)
      ));
    return !!membership;
  }

  async getChatMessages(tourId: string): Promise<(ChatMessage & { user: User })[]> {
    const result = await db
      .select({
        message: chatMessages,
        user: users,
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.tourId, tourId))
      .orderBy(chatMessages.timestamp);

    return result.map(row => ({
      ...row.message,
      user: row.user!,
    }));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage & { user: User }> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, message.userId));

    return {
      ...newMessage,
      user: user!,
    };
  }

  async getCommunityPosts(): Promise<(CommunityPost & { user: User; tour?: Tour })[]> {
    const result = await db
      .select({
        post: communityPosts,
        user: users,
        tour: tours,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .leftJoin(tours, eq(communityPosts.tourId, tours.id))
      .orderBy(desc(communityPosts.createdAt));

    return result.map(row => ({
      ...row.post,
      user: row.user!,
      tour: row.tour || undefined,
    }));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db
      .insert(communityPosts)
      .values(post)
      .returning();
    return newPost;
  }
}

export const storage = new DatabaseStorage();
