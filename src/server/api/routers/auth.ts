// ~/server/api/routers/auth.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

// Define the registration schema to match your form
const registerSchema = z
  .object({
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string(),
    firstName: z.string().min(1, "First name is required"),
    role: z.string().min(1, "Role is required"),
    idNumber: z.string().min(1, "ID number is required"),
    college: z.string().min(1, "College is required"),
    email: z
      .string()
      .email("Invalid email address")
      .regex(
        /^[\w.-]+@(isatu\.edu\.ph|students\.isatu\.edu\.ph)$/,
        "Email must end with @isatu.edu.ph or @students.isatu.edu.ph",
      ),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    image: z.string().url("Invalid image URL").optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = input;

      try {
        // Check if user already exists
        const existingUser = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email already exists",
          });
        }

        // Check if ID number already exists
        const existingId = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.idNumber, input.idNumber),
        });

        if (existingId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this ID number already exists",
          });
        }

        // Create the user
        const [newUser] = await ctx.db
          .insert(users)
          .values({
            id: crypto.randomUUID(), // Required since your schema doesn't auto-generate
            email: userData.email,
            password: userData.password, // Note: You should hash this password before storing
            name: `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            role: userData.role,
            idNumber: userData.idNumber,
            college: userData.college,
            image: userData.image, // Add the image URL to the database
          })
          .returning();

        // Don't return the password in the response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = newUser!;

        return {
          success: true,
          message: "User registered successfully",
          user: userWithoutPassword,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        // Log the actual error for debugging
        console.error("Registration error:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),
});
