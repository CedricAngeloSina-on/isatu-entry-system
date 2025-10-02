import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users, vehicles } from "~/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const vehicleRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        vehicleColor: z.string(),
        vehicleType: z.string(),
        plateNumber: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.insert(vehicles).values({
          user_id: String(ctx.session?.user.id),
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

  getMyVehicles: publicProcedure.query(async ({ ctx }) => {
    const myVehicles = await ctx.db
      .select({
        id: vehicles.id,
        vehicleColor: sql<string>`COALESCE(${vehicles.vehicleColor}, '')`,
        vehicleType: sql<string>`COALESCE(${vehicles.vehicleType}, '')`,
        plateNumber: sql<string>`COALESCE(${vehicles.plateNumber}, '')`,
      })
      .from(vehicles)
      .innerJoin(users, eq(vehicles.user_id, users.id))
      .where(eq(vehicles.user_id, String(ctx.session?.user.id)))
      .orderBy(desc(vehicles.id));

    return myVehicles;
  }),
});
