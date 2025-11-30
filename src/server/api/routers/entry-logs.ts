import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { entry_logs, users, vehicles } from "~/server/db/schema";
import { ilike, and, eq, desc, sql } from "drizzle-orm";

export const entryLogRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        plateNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const vehicle = await ctx.db
          .select()
          .from(vehicles)
          .where(
            and(
              ilike(vehicles.user_id, String(input.user_id)),
              ilike(vehicles.plateNumber, input.plateNumber),
            ),
          )
          .limit(1);

        if (vehicle.length === 0) {
          return; // or throw new Error("Student not found")
        }

        console.log(vehicle);

        const result = await ctx.db.insert(entry_logs).values({
          vehicle_id: Number(vehicle[0]?.id),
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
        .from(entry_logs)
        .leftJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
        .leftJoin(users, eq(vehicles.user_id, users.id))
        .$dynamic();

      // Base query for data
      let dataQuery = ctx.db
        .select({
          id: entry_logs.id,
          name: sql<string>`COALESCE(${users.name}, '')`,
          idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
          college: sql<string>`COALESCE(${users.college}, '')`,
          plateNumber: sql<string>`COALESCE(UPPER(${vehicles.plateNumber}), '')`,
          vehicleType: sql<string>`COALESCE(UPPER(${vehicles.vehicleType}), '')`,
          timestamp: entry_logs.timestamp,
        })
        .from(entry_logs)
        .leftJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
        .leftJoin(users, eq(vehicles.user_id, users.id))
        .$dynamic();

      // Apply search filter to both queries
      if (searchTerm) {
        const searchCondition = sql`(LOWER(${users.name}) LIKE LOWER(${"%" + searchTerm + "%"}) OR LOWER(${vehicles.plateNumber}) LIKE LOWER(${"%" + searchTerm + "%"}))`;
        countQuery = countQuery.where(searchCondition);
        dataQuery = dataQuery.where(searchCondition);
      }

      // Execute count query
      const [countResult] = await countQuery;
      const total = Number(countResult?.count ?? 0);

      // Execute data query with pagination
      const entries = await dataQuery
        .orderBy(desc(entry_logs.timestamp))
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

  getMyEntries: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().default(1),
        perPage: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerm = input.search?.trim();
      const userId = String(ctx.session?.user.id);
      const offset = (input.page - 1) * input.perPage;

      // Base query for counting total
      let countQuery = ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(entry_logs)
        .innerJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
        .innerJoin(users, eq(vehicles.user_id, users.id))
        .where(eq(vehicles.user_id, userId))
        .$dynamic();

      // Base query for data
      let dataQuery = ctx.db
        .select({
          id: entry_logs.id,
          name: sql<string>`COALESCE(${users.name}, '')`,
          idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
          college: sql<string>`COALESCE(${users.college}, '')`,
          plateNumber: sql<string>`COALESCE(UPPER(${vehicles.plateNumber}), '')`,
          vehicleType: sql<string>`COALESCE(UPPER(${vehicles.vehicleType}), '')`,
          timestamp: entry_logs.timestamp,
        })
        .from(entry_logs)
        .innerJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
        .innerJoin(users, eq(vehicles.user_id, users.id))
        .where(eq(vehicles.user_id, userId))
        .$dynamic();

      // Apply search filter to both queries
      if (searchTerm) {
        const searchCondition = sql`${vehicles.user_id} = ${userId} AND (LOWER(${users.name}) LIKE LOWER(${"%" + searchTerm + "%"}) OR LOWER(${vehicles.plateNumber}) LIKE LOWER(${"%" + searchTerm + "%"}))`;
        countQuery = countQuery.where(searchCondition);
        dataQuery = dataQuery.where(searchCondition);
      }

      // Execute count query
      const [countResult] = await countQuery;
      const total = Number(countResult?.count ?? 0);

      // Execute data query with pagination
      const entries = await dataQuery
        .orderBy(desc(entry_logs.timestamp))
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
