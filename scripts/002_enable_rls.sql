-- Enable Row Level Security on all tables

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_country_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chef_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chef_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Posts policies (anyone can view, only owner can modify)
CREATE POLICY "posts_select_all" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "interactions_select_all" ON public.interactions FOR SELECT USING (true);
CREATE POLICY "interactions_insert_own" ON public.interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "interactions_update_own" ON public.interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "interactions_delete_own" ON public.interactions FOR DELETE USING (auth.uid() = user_id);

-- User country interactions policies
CREATE POLICY "user_country_interactions_select_own" ON public.user_country_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_country_interactions_insert_own" ON public.user_country_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_country_interactions_update_own" ON public.user_country_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_country_interactions_delete_own" ON public.user_country_interactions FOR DELETE USING (auth.uid() = user_id);

-- Chef chats policies
CREATE POLICY "chef_chats_select_own" ON public.chef_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chef_chats_insert_own" ON public.chef_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chef_chats_update_own" ON public.chef_chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "chef_chats_delete_own" ON public.chef_chats FOR DELETE USING (auth.uid() = user_id);

-- Chef messages policies (accessible if user owns the chat)
CREATE POLICY "chef_messages_select_own" ON public.chef_messages 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chef_chats WHERE id = chat_id AND user_id = auth.uid())
  );
CREATE POLICY "chef_messages_insert_own" ON public.chef_messages 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chef_chats WHERE id = chat_id AND user_id = auth.uid())
  );
CREATE POLICY "chef_messages_delete_own" ON public.chef_messages 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.chef_chats WHERE id = chat_id AND user_id = auth.uid())
  );
