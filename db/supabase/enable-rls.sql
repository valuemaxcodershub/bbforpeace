-- Enable Row Level Security and add explicit policies for the tables exposed
-- through Supabase/PostgREST.
-- Run this in the Supabase SQL editor or your deployment migration pipeline.

do $$
declare
	table_name text;
	policy_name text;
	public_tables text[] := array[
		'site_settings_menu_structure_report_submenu',
		'site_settings_annual_report_placeholders',
		'posts_media_gallery',
		'publications',
		'posts_rels',
		'team',
		'partners',
		'programmes_objectives',
		'programmes_achievements',
		'events',
		'programmes_gallery',
		'tags',
		'programmes',
		'site_settings_hero_slides',
		'site_settings_typewriter_phrases',
		'site_settings_core_values',
		'site_settings_menu_structure_about_us_submenu',
		'site_settings_impact_stats',
		'site_settings_about_highlights',
		'partners_settings_items',
		'partners_settings',
		'footer_settings',
		'award_settings',
		'social_media_settings',
		'site_settings',
		'contact_settings',
		'home_page_settings_hero_slides',
		'home_page_settings_typewriter_phrases',
		'home_page_settings_impact_highlights',
		'home_page_settings_impact_stats',
		'home_page_settings_about_highlights',
		'home_page_settings_focus_areas',
		'home_page_settings_approach_pillars',
		'general_settings',
		'home_page_settings_videos',
		'home_page_settings_awards',
		'about_us_page_settings_milestones',
		'home_page_settings_initiatives',
		'about_us_page_settings_core_values',
		'about_us_page_settings_strategic_pillars',
		'about_us_page_settings_unique_points',
		'about_us_page_settings_about_awards',
		'programme_page_settings',
		'event_page_settings',
		'media_page_settings_testimonials',
		'media_page_settings',
		'media_page_settings_gallery_videos',
		'reports_settings_annual_reports',
		'media_page_settings_gallery_images',
		'about_us_page_settings',
		'media',
		'posts',
		'categories',
		'site_settings_menu_structure_media_submenu',
		'home_page_settings',
		'reports_settings',
		'reports_settings_strategic_pillars',
		'contact_us_page_settings',
		'contact_us_page_settings_offices',
		'award_settings_awards',
		'gallery_items',
		'testimonials',
		'seo_settings'
	];
	private_tables text[] := array[
		'users',
		'users_sessions',
		'payload_kv',
		'payload_preferences',
		'payload_preferences_rels',
		'payload_migrations',
		'payload_locked_documents',
		'payload_locked_documents_rels',
		'subscribers'
	];
begin
	foreach table_name in array public_tables loop
		execute format('alter table if exists public.%I enable row level security', table_name);

		policy_name := table_name || '_select_public';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for select to anon, authenticated using (true)', policy_name, table_name);

		policy_name := table_name || '_insert_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for insert to authenticated with check (true)', policy_name, table_name);

		policy_name := table_name || '_update_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for update to authenticated using (true) with check (true)', policy_name, table_name);

		policy_name := table_name || '_delete_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for delete to authenticated using (true)', policy_name, table_name);
	end loop;

	foreach table_name in array private_tables loop
		execute format('alter table if exists public.%I enable row level security', table_name);

		policy_name := table_name || '_select_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for select to authenticated using (true)', policy_name, table_name);

		policy_name := table_name || '_insert_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for insert to authenticated with check (true)', policy_name, table_name);

		policy_name := table_name || '_update_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for update to authenticated using (true) with check (true)', policy_name, table_name);

		policy_name := table_name || '_delete_authenticated';
		execute format('drop policy if exists %I on public.%I', policy_name, table_name);
		execute format('create policy %I on public.%I for delete to authenticated using (true)', policy_name, table_name);
	end loop;
end $$;
