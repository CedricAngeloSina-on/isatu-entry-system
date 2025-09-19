CREATE TABLE "entry_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(255) NOT NULL,
	"plate_number" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
