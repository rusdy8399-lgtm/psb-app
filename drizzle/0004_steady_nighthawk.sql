CREATE TABLE `hero_section` (
	`id` text PRIMARY KEY NOT NULL,
	`badge` text DEFAULT 'INFO PESANTREN',
	`title` text NOT NULL,
	`subtitle` text,
	`bg_image_url` text NOT NULL,
	`fg_image_url` text,
	`is_active` integer DEFAULT true,
	`order` integer DEFAULT 0
);
