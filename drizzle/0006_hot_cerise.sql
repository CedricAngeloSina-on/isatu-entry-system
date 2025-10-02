CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"vehicleType" varchar(255) NOT NULL,
	"vehicleColor" varchar(255) NOT NULL,
	"plateNumber" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entry_logs" ADD COLUMN "vehicle_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "entry_logs" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "entry_logs" DROP COLUMN "idNumber";--> statement-breakpoint
ALTER TABLE "entry_logs" DROP COLUMN "plateNumber";