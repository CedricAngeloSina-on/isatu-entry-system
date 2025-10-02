import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { entry_logs, users, vehicles } from "~/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const entryLogRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       vehicle_id: z.string().uuid(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const vehicle = await ctx.db
  //         .select()
  //         .from(vehicles)
  //         .where(eq(vehicles.id, Number(input.vehicle_id)))
  //         .limit(1);

  //       if (vehicle.length === 0) {
  //         return; // or throw new Error("Student not found")
  //       }

  //       const result = await ctx.db.insert(entry_logs).values({
  //         vehicle_id: String(vehicle[0]?.id),
  //       });

  //       return result;
  //     } catch (error) {
  //       console.error("Error logging entry:", error);
  //       throw new Error("Failed to log entry");
  //     }
  //   }),

  getAllEntries: publicProcedure.query(async ({ ctx }) => {
    const entries = await ctx.db
      .select({
        id: entry_logs.id,
        name: sql<string>`COALESCE(${users.name}, '')`,
        idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
        college: sql<string>`COALESCE(${users.college}, '')`,
        plateNumber: sql<string>`COALESCE(${vehicles.plateNumber}, '')`,
        vehicleType: sql<string>`COALESCE(${vehicles.vehicleType}, '')`,
        timestamp: entry_logs.timestamp,
      })
      .from(entry_logs)
      .leftJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
      .leftJoin(users, eq(vehicles.user_id, users.id))
      .orderBy(desc(entry_logs.timestamp));

    return entries;
  }),

  getMyEntries: publicProcedure.query(async ({ ctx }) => {
    const entries = await ctx.db
      .select({
        id: entry_logs.id,
        name: sql<string>`COALESCE(${users.name}, '')`,
        idNumber: sql<string>`COALESCE(${users.idNumber}, '')`,
        college: sql<string>`COALESCE(${users.college}, '')`,
        plateNumber: sql<string>`COALESCE(${vehicles.plateNumber}, '')`,
        vehicleType: sql<string>`COALESCE(${vehicles.vehicleType}, '')`,
        timestamp: entry_logs.timestamp,
      })
      .from(entry_logs)
      .innerJoin(vehicles, eq(entry_logs.vehicle_id, vehicles.id))
      .innerJoin(users, eq(vehicles.user_id, users.id))
      .where(eq(vehicles.user_id, String(ctx.session?.user.id)))
      .orderBy(desc(entry_logs.timestamp));

    return entries;
  }),
});
