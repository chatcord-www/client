import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `client_${name}`);
export const activityEnum = pgEnum("activity", [
  "ONLINE",
  "IDLE",
  "DND",
  "OFFLINE",
]);
export const channelType = pgEnum("type", ["VOICE", "TEXT"])

export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
    discriminator: varchar("discriminator", { length: 4 }),
    activity: activityEnum("activity").default("ONLINE"),
    aboutMe: varchar("about_me", { length: 255 }),
    status: json("status").$type<{ emoji: string; title: string }>(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (users) => ({
    uniqueUserDiscriminator: uniqueIndex("unique_user_discriminator").on(
      users.name,
      users.discriminator,
    ),
  }),
);

export const servers = createTable("server", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  icon: varchar("icon", { length: 255 }),
  public: boolean("public").default(false),
  ownerId: varchar("ownerId")
    .notNull()
    .references(() => users.id),
});

export const categories = createTable("category", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  serverId: varchar("serverId", { length: 255 }).references(() => servers.id),
});

export const channels = createTable("channel", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  categoryId: varchar("category_id", { length: 255 }).references(
    () => categories.id,
  ),
  serverId: varchar("serverId", { length: 255 }).references(() => servers.id),
  type: channelType("type").default("TEXT"),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  channels: many(channels),
  server: one(servers, {
    fields: [categories.serverId],
    references: [servers.id],
  }),
}));

export const channelsRelations = relations(channels, ({ one }) => ({
  category: one(categories, {
    fields: [channels.categoryId],
    references: [categories.id],
  }),
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
}));

export const usersToServers = createTable("users_to_servers", {
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  serverId: varchar("serverId", { length: 255 })
    .notNull()
    .references(() => servers.id),
});

export const usersToServersRelations = relations(usersToServers, ({ one }) => ({
  user: one(users, {
    fields: [usersToServers.userId],
    references: [users.id],
  }),
  server: one(servers, {
    fields: [usersToServers.serverId],
    references: [servers.id],
  }),
}));

export const serversRelations = relations(servers, ({ one, many }) => ({
  owner: one(users, {
    fields: [servers.ownerId],
    references: [users.id],
  }),
  members: many(usersToServers),
  categories: many(categories),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
