import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),

  // Additional fields from your registration form
  firstName: varchar("firstName", { length: 255 }),
  middleName: varchar("middleName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  role: varchar("role", { length: 255 }),
  idNumber: varchar("idNumber", { length: 255 }),
  college: varchar("college", { length: 255 }),
});

// Rest of your existing schema...
export const accounts = pgTable(
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

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const entry_logs = pgTable("entry_logs", {
  id: serial("id").primaryKey(),
  vehicle_id: varchar("vehicle_id", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 255 }).notNull(),
  vehicleColor: varchar("vehicleColor", { length: 255 }).notNull(),
  plateNumber: varchar("plateNumber", { length: 255 }).notNull(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));
