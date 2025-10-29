import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { visitor_entry_logs } from "~/server/db/schema";
import { desc, sql } from "drizzle-orm";

export const visitorEntryLogRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        vehicleColor: z.string(),
        vehicleType: z.string(),
        plateNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.insert(visitor_entry_logs).values({
          name: String(input.name),
          vehicleColor: String(input.vehicleColor),
          vehicleType: String(input.vehicleType),
          plateNumber: String(input.plateNumber),
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
        id: visitor_entry_logs.id,
        name: sql<string>`COALESCE(${visitor_entry_logs.name}, '')`,
        vehicleColor: sql<string>`COALESCE(UPPER(${visitor_entry_logs.vehicleColor}), '')`,
        vehicleType: sql<string>`COALESCE(UPPER(${visitor_entry_logs.vehicleType}), '')`,
        plateNumber: sql<string>`COALESCE(UPPER(${visitor_entry_logs.plateNumber}), '')`,
        timestamp: visitor_entry_logs.timestamp,
      })
      .from(visitor_entry_logs)
      .orderBy(desc(visitor_entry_logs.timestamp));

    return entries;
  }),
});
