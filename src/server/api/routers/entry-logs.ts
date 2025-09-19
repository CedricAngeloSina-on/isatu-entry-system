import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { entry_logs, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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

        return {
          success: true,
          message: "Entry logged successfully",
        };
      } catch (error) {
        console.error("Error logging entry:", error);
        throw new Error("Failed to log entry");
      }
    }),

  // Optional: Add a query to get recent entries
  getRecent: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const entries = await ctx.db
        .select()
        .from(entry_logs)
        .limit(input.limit)
        .orderBy(/* add your timestamp column here, e.g., desc(entry_logs.created_at) */);

      return entries;
    }),
});
