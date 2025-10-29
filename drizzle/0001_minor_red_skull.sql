CREATE TABLE "visitor_entry_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"vehicleType" varchar(255) NOT NULL,
	"vehicleColor" varchar(255) NOT NULL,
	"plateNumber" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
