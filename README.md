# Deep Wood - Premium Furniture & Woodwork

A production-ready bilingual (Arabic/English) web application for a premium furniture & woodwork company.

## 🌟 Features

- **Bilingual Support** (Arabic RTL / English LTR)
- **Public Website**: Home, About, Services, Portfolio, Shop, Contact
- **Admin Dashboard**: Full CRUD management for all content
- **SEO Optimized**: Meta tags, structured data, clean URLs
- **WhatsApp Integration**: Easy ordering via WhatsApp
- **Cloudinary**: Image and video uploads
- **JWT Authentication**: Secure admin access

## 🏗️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary Integration
- RESTful API

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Server-Side Rendering (SSR)
- i18n (Arabic/English)

## 📁 Project Structure

```
deepWood/
├── backend/
│   ├── config/         # Database config
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth, upload, validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Cloudinary, slug, api features
│   ├── seed/           # Database seeding
│   └── server.js       # Entry point
│
└── frontend/
    ├── app/
    │   ├── [locale]/   # Public pages (EN/AR)
    │   └── admin/      # Admin dashboard
    ├── components/     # Reusable components
    ├── lib/            # API client
    └── locales/        # Translations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (optional)

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Seed database
npm run seed

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Default Admin Credentials
- **Email**: admin@deepwood.com
- **Password**: admin123456

## 📡 API Endpoints

| Resource | Endpoints |
|----------|-----------|
| Auth | POST /api/auth/login, /api/auth/register |
| Products | GET/POST /api/products, GET/PUT/DELETE /api/products/:id |
| Projects | GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id |
| Categories | GET/POST /api/categories, GET/PUT/DELETE /api/categories/:id |
| Services | GET/POST /api/services, GET/PUT/DELETE /api/services/:id |
| Clients | GET/POST /api/clients, GET/PUT/DELETE /api/clients/:id |
| Testimonials | GET/POST /api/testimonials, GET/PUT/DELETE /api/testimonials/:id |
| Orders | GET/POST /api/orders, PUT /api/orders/:id/status |
| Contacts | GET/POST /api/contacts, POST /api/contacts/:id/respond |

## 🌐 URLs

### Public Pages
- `/en` or `/ar` - Home
- `/en/about` - About Us
- `/en/services` - Services
- `/en/portfolio` - Portfolio
- `/en/shop` - Shop
- `/en/contact` - Contact

### Admin
- `/admin/login` - Login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Manage Products
- `/admin/projects` - Manage Projects

## 🎨 Brand Colors

| Color | Hex |
|-------|-----|
| Deep Brown | #3C2415 |
| Beige | #E8DCC4 |
| Matte Black | #1A1A1A |
| Gold | #C9A962 |
| Cream | #F5F0E8 |

## 📝 Corporate Clients

Featured corporate projects:
- Toyota Egypt
- Toshiba El Araby
- Raya

## 📄 License

ISC License
