CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`source` text NOT NULL,
	`total_modules` integer DEFAULT 0 NOT NULL,
	`completed_modules` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`starter_code` text NOT NULL,
	`expected_output` text NOT NULL,
	`hints` text NOT NULL,
	`difficulty` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`module_order` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`key_concepts` text NOT NULL,
	`duration_minutes` integer DEFAULT 12 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`selected_index` integer NOT NULL,
	`correct` integer NOT NULL,
	`attempted_at` integer NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` integer NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correct_index` integer NOT NULL,
	`explanation` text NOT NULL,
	`difficulty` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_xp` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`lessons_completed` integer DEFAULT 0 NOT NULL,
	`quizzes_passed` integer DEFAULT 0 NOT NULL,
	`courses_completed` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
