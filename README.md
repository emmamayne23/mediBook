# MediBook - Medical Appointment Booking System

A comprehensive full-stack medical appointment booking platform that streamlines healthcare access for patients, doctors, and clinic administrators.

## Overview

MediBook is a role-based web application designed to modernize the medical appointment booking process. Built with Next.js and powered by a robust PostgreSQL database, it offers seamless appointment management for healthcare providers and patients alike.


<img width="2219" height="1171" alt="homepage" src="https://github.com/user-attachments/assets/f899f4e9-8181-4dec-bed2-1be64b204d8c" />


## 🌟 Key Features

### For Patients
- **Doctor Discovery**: Search and filter doctors by specialty, location, and availability
- **Smart Booking**: View real-time availability and book appointments instantly
- **Profile Management**: Manage personal health information and appointment history
- **Reviews & Ratings**: Leave feedback and read reviews from other patients
- **Appointment Control**: Cancel or reschedule appointments with ease

### For Doctors
- **Professional Profiles**: Showcase qualifications, experience, and specializations
- **Schedule Management**: Create and manage available time slots
- **Appointment Dashboard**: View upcoming appointments and patient information
- **Review Monitoring**: Track patient feedback and ratings
- **Practice Analytics**: Insights into booking patterns and patient reviews

### For Administrators
- **Unified Dashboard**: Access to all system operations and analytics
- **User Management**: Manage doctor and patient accounts
- **Appointment Oversight**: Monitor and manage all appointments system-wide
- **System Analytics**: Comprehensive reporting and insights

## 🛠️ Tech Stack

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Auth.js-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Neon Database** - Serverless PostgreSQL hosting

### Authentication & Security
- **Auth.js** - Secure authentication system
- **Role-based Access Control** - Patient, Doctor, and Admin roles
- **JWT Tokens** - Secure session management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon account recommended)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/medibook.git
cd medibook
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
cp .env.example .env.local

# Configure your environment variables:
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Set up the database**
```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
npm run db:seed  # Optional: Add sample data
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
medibook/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Role-based dashboards
│   ├── api/                 # API routes
│   ├── components/          # Reusable components
│   └── globals.css          # Global styles
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   ├── db.ts               # Database connection
│   └── utils.ts            # Utility functions
├── drizzle/
│   ├── schema.ts           # Database schema
│   └── migrations/         # Database migrations
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   └── dashboard/          # Dashboard components
└── public/
    └── images/             # Static assets
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

## 🔐 Authentication & Authorization

MediBook implements a comprehensive role-based access control system:

- **Patients**: Can book appointments, view their history, and leave reviews
- **Doctors**: Can manage their profiles, availability, and view appointments
- **Admins**: Have full system access and user management capabilities

## 🚀 Deployment

The application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🔮 Future Improvements

- [ ] Real-time notifications for appointment updates
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Advanced search and filtering options
- [ ] Mobile app companion (MediCare)
- [ ] Multi-language support
- [ ] Insurance verification system
- [ ] Prescription management
- [ ] Analytics dashboard for clinics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Auth.js](https://authjs.dev/) - Authentication library
- [Neon](https://neon.tech/) - Serverless PostgreSQL
