# ShareIt — Private Movie Sharing Platform

A full-stack movie sharing web application for personal/private use. Upload, stream, and download movies with a Netflix-inspired dark UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwindcss)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Video_Storage-3448c5?style=flat-square)

## Features

- 🔐 **Simple Auth** — Username-only gate for private access
- 📤 **Upload Movies** — Drag & drop with progress tracking
- 🎬 **Stream Videos** — HTML5 video player with Cloudinary CDN
- ⬇️ **Download** — Force-download any movie
- 🗑️ **Delete** — Remove from Cloudinary + local storage
- 🔍 **Search** — Filter movies by name
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark UI** — Netflix-inspired design with red accents

## Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | Next.js 15 (App Router)  |
| Language  | TypeScript               |
| Styling   | Tailwind CSS 4           |
| Forms     | React Hook Form          |
| HTTP      | Axios                    |
| Storage   | Cloudinary (video)       |
| Metadata  | Local JSON file          |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Shareit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Cloudinary

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com)
2. Copy your **Cloud Name**, **API Key**, and **API Secret**
3. Create an **Unsigned Upload Preset**:
   - Go to **Settings → Upload → Upload presets**
   - Click **Add upload preset**
   - Set **Signing Mode** to **Unsigned**
   - Set **Folder** to `shareit` (optional)
   - Save and copy the preset name

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Cloudinary credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB=500
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Login

Use the username: **`ssmriti`**

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── movies/
│   │       ├── route.ts          # GET, POST /api/movies
│   │       └── [id]/
│   │           └── route.ts      # GET, DELETE /api/movies/:id
│   ├── dashboard/
│   │   └── page.tsx              # Movie library grid
│   ├── login/
│   │   └── page.tsx              # Username login
│   ├── upload/
│   │   └── page.tsx              # Upload page
│   ├── watch/
│   │   └── [id]/
│   │       └── page.tsx          # Video player
│   ├── globals.css               # Dark theme + animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root redirect
├── components/
│   ├── ui/
│   │   ├── EmptyState.tsx        # Empty collection UI
│   │   ├── ProgressBar.tsx       # Upload progress
│   │   ├── Skeleton.tsx          # Loading skeletons
│   │   └── Toast.tsx             # Toast notifications
│   ├── AuthGuard.tsx             # Auth protection wrapper
│   ├── DeleteConfirmModal.tsx    # Delete confirmation
│   ├── MovieCard.tsx             # Individual movie card
│   ├── MovieGrid.tsx             # Responsive card grid
│   ├── Navbar.tsx                # Top navigation bar
│   ├── UploadZone.tsx            # Drag & drop upload
│   └── VideoPlayer.tsx           # HTML5 video player
├── hooks/
│   └── useAuth.ts                # Auth state management
├── lib/
│   ├── cloudinary.ts             # Server-side Cloudinary config
│   ├── constants.ts              # App constants
│   ├── format.ts                 # Formatting utilities
│   └── movies-db.ts              # JSON file-based storage
└── types/
    ├── auth.ts                   # Auth types
    └── movie.ts                  # Movie types
```

## API Routes

| Method | Route              | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/movies`      | List all movies       |
| POST   | `/api/movies`      | Save movie metadata   |
| GET    | `/api/movies/:id`  | Get single movie      |
| DELETE | `/api/movies/:id`  | Delete movie          |

## Deployment (Vercel)

### Important Notes

1. **File Storage**: The current JSON file storage will NOT persist on Vercel serverless. For production:
   - Use a database (PostgreSQL + Prisma recommended)
   - Or use Vercel KV / Upstash Redis
   - Or store metadata directly in Cloudinary resource tags

2. **Upload Flow**: Videos upload directly from the browser to Cloudinary (bypassing serverless body limits), then metadata is saved via the API.

### Deploy Steps

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or deploy via CLI
npm i -g vercel
vercel --prod
```

## Future Improvements

- [ ] Database storage (Prisma + PostgreSQL)
- [ ] Multi-user support with proper authentication
- [ ] Video transcoding & quality selection
- [ ] Folder/category organization
- [ ] Share links with expiration
- [ ] Watch history & resume playback
- [ ] Subtitle support (.srt/.vtt)
- [ ] Batch upload

## License

Private use only.
