import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { entry_logs, users } from "~/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const entryLogRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user_id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const student = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, input.user_id))
          .limit(1);

        if (student.length === 0) {
          return; // or throw new Error("Student not found")
        }

        const result = await ctx.db.insert(entry_logs).values({
          user_id: String(student[0]?.id),
          idNumber: String(student[0]?.idNumber),
          plateNumber: String(student[0]?.plateNumber),
        });

        return result;
      } catch (error) {
        console.error("Error logging entry:", error);
        throw new Error("Failed to log entry");
      }
    }),

  getAllEntries: publicProcedure.query(async ({ ctx }) => {
    const entries = await ctx.db
      .select({
        id: entry_logs.id,
        idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
        plateNumber: sql<string>`COALESCE(${users.plateNumber}, '')`,
        vehicleType: sql<string>`COALESCE(UPPER(${users.vehicleType}), '')`,
        timestamp: entry_logs.timestamp,
      })
      .from(entry_logs)
      .innerJoin(users, eq(entry_logs.user_id, users.id))
      .orderBy(desc(entry_logs.timestamp));

    return entries;
  }),

  getMyEntries: publicProcedure.query(async ({ ctx }) => {
    const entries = await ctx.db
      .select({
        id: entry_logs.id,
        idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
        plateNumber: sql<string>`COALESCE(${users.plateNumber}, '')`,
        vehicleType: sql<string>`COALESCE(UPPER(${users.vehicleType}), '')`,
        timestamp: entry_logs.timestamp,
      })
      .from(entry_logs)
      .innerJoin(users, eq(entry_logs.user_id, users.id))
      .where(eq(entry_logs.user_id, String(ctx.session?.user.id)))
      .orderBy(desc(entry_logs.timestamp));

    return entries;
  }),
});
