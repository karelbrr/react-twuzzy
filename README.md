# Twüzzy

A real-time chat application built with React and Supabase. It includes 1-on-1 messaging, group chats, media sharing, and customizable profiles.

## Tech Stack

- **Core:** React, TypeScript, Vite
- **Backend & Auth:** Supabase
- **Data Fetching:** React Query
- **Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion
- **Forms:** React Hook Form

## Features

- Real-time messaging using Supabase subscriptions
- OAuth authentication (GitHub, Discord)
- Direct messages and public/private group chats
- Media sharing (images, audio, documents)
- YouTube and Spotify link embeds
- User profiles with avatars, bios, and badges
- Discover section for finding new users and groups
- Privacy settings and user blocking

## Running the project

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/your-username/react-twuzzy.git
   cd react-twuzzy
   npm install
   ```

2. Create a `.env` file in the root directory and add your Supabase keys:
   ```env
   VITE_API_URL=your_supabase_url
   VITE_API_KEY=your_supabase_anon_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup Requirements

To get everything working, you'll need to set up the following in your Supabase project:
- Enable GitHub and Discord in Auth providers.
- Create the necessary tables (`profiles`, `chats`, `messages`, `groups`, `group_members`, `group_messages`, `badges`, `user_badges`, `blocked_users`).
- Set up Storage buckets: `images`, `pfps`, and `avatarsgroups`.
- Turn on Realtime for the `messages`, `chats`, and `group_messages` tables.
