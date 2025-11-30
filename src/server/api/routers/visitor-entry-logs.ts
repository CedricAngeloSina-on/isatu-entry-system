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

  getAllEntries: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().default(1),
        perPage: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerm = input.search?.trim();
      const offset = (input.page - 1) * input.perPage;

      // Base query for counting total
      let countQuery = ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(visitor_entry_logs)
        .$dynamic();

      // Base query for data
      let dataQuery = ctx.db
        .select({
          id: visitor_entry_logs.id,
          name: sql<string>`COALESCE(${visitor_entry_logs.name}, '')`,
          vehicleColor: sql<string>`COALESCE(UPPER(${visitor_entry_logs.vehicleColor}), '')`,
          vehicleType: sql<string>`COALESCE(UPPER(${visitor_entry_logs.vehicleType}), '')`,
          plateNumber: sql<string>`COALESCE(UPPER(${visitor_entry_logs.plateNumber}), '')`,
          timestamp: visitor_entry_logs.timestamp,
        })
        .from(visitor_entry_logs)
        .$dynamic();

      // Apply search filter to both queries
      if (searchTerm) {
        const searchCondition = sql`(LOWER(${visitor_entry_logs.name}) LIKE LOWER(${"%" + searchTerm + "%"}) OR LOWER(${visitor_entry_logs.plateNumber}) LIKE LOWER(${"%" + searchTerm + "%"}))`;
        countQuery = countQuery.where(searchCondition);
        dataQuery = dataQuery.where(searchCondition);
      }

      // Execute count query
      const [countResult] = await countQuery;
      const total = Number(countResult?.count ?? 0);

      // Execute data query with pagination
      const entries = await dataQuery
        .orderBy(desc(visitor_entry_logs.timestamp))
        .limit(input.perPage)
        .offset(offset);

      return {
        data: entries,
        total,
        page: input.page,
        perPage: input.perPage,
        pageCount: Math.ceil(total / input.perPage),
      };
    }),
});
