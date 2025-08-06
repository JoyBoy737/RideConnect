import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  avatar: text("avatar"),
  location: text("location"),
  toursJoined: integer("tours_joined").default(0),
  milesTraveled: integer("miles_traveled").default(0),
  photosShared: integer("photos_shared").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tours = pgTable("tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  duration: text("duration").notNull(), // e.g., "3 Days"
  distance: text("distance").notNull(), // e.g., "450 miles"
  difficulty: text("difficulty").notNull(), // Easy, Moderate, Challenging
  bikeType: text("bike_type").default("Any"),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  status: text("status").default("open"), // open, closed, active, completed
  route: jsonb("route"), // Array of stops/waypoints
  heroImage: text("hero_image"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tourMemberships = pgTable("tour_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").notNull().references(() => tours.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text("role").default("member"), // creator, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").notNull().references(() => tours.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imageData: text("image_data"), // Base64 encoded image data
  tourId: varchar("tour_id").references(() => tours.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdTours: many(tours),
  tourMemberships: many(tourMemberships),
  chatMessages: many(chatMessages),
  communityPosts: many(communityPosts),
}));

export const toursRelations = relations(tours, ({ one, many }) => ({
  creator: one(users, {
    fields: [tours.createdBy],
    references: [users.id],
  }),
  memberships: many(tourMemberships),
  chatMessages: many(chatMessages),
  communityPosts: many(communityPosts),
}));

export const tourMembershipsRelations = relations(tourMemberships, ({ one }) => ({
  tour: one(tours, {
    fields: [tourMemberships.tourId],
    references: [tours.id],
  }),
  user: one(users, {
    fields: [tourMemberships.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  tour: one(tours, {
    fields: [chatMessages.tourId],
    references: [tours.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one }) => ({
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  tour: one(tours, {
    fields: [communityPosts.tourId],
    references: [tours.id],
  }),
}));

// Schema exports
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  currentParticipants: true,
  status: true,
  createdBy: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type TourMembership = typeof tourMemberships.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
