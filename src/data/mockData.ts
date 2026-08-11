import {
  ModelProfile,
  AgencyProfile,
  ScoutProfile,
  CastingCall,
  EventItem,
  NewsItem,
  DocumentItem,
  CertificateItem,
  MembershipApplication,
  User,
  EmailNotification
} from '../types/arma';

export const INITIAL_MODELS: ModelProfile[] = [
  {
    id: 'mod-001', userId: 'usr-amani', fullName: 'Amani Uwase', stageName: 'Amani U.',
    category: 'Editorial', gender: 'Female', agencyId: 'age-001', agencyName: 'Kigali Faces Agency',
    province: 'Kigali City', district: 'Gasabo',
    photos: { headshot: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900', fullBody: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900', gallery: [] },
    measurements: { heightCm: 178, shoeSizeEu: 39, hairColor: 'Black', eyeColor: 'Brown', bustCm: 82, waistCm: 61, hipsCm: 90 },
    nationality: 'Rwandan', languages: ['Kinyarwanda', 'English', 'French'], experienceYears: 5,
    bio: 'Editorial and runway model bringing a precise, contemporary presence to regional and international fashion.',
    achievements: ['Kigali Fashion Week 2025', 'East Africa New Face finalist'], socials: { instagram: '@amani.uwase' },
    availability: 'Available', verifiedBadge: true, featured: true, rating: 4.9
  },
  {
    id: 'mod-002', userId: 'usr-cedric', fullName: 'Cedric Niyonzima', stageName: 'Cedric N.',
    category: 'Commercial', gender: 'Male', province: 'Southern Province', district: 'Huye',
    photos: { headshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900', fullBody: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900', gallery: [] },
    measurements: { heightCm: 186, shoeSizeEu: 44, hairColor: 'Black', eyeColor: 'Brown' },
    nationality: 'Rwandan', languages: ['Kinyarwanda', 'English'], experienceYears: 3,
    bio: 'Commercial and lifestyle model known for a warm, confident presence and dependable set etiquette.',
    achievements: ['Rwanda Brand Campaign 2025'], socials: { instagram: '@cedric.niyonzima' },
    availability: 'Available', verifiedBadge: true, featured: true, rating: 4.7
  }
];

export const INITIAL_AGENCIES: AgencyProfile[] = [{
  id: 'age-001', userId: 'usr-kigali-faces', agencyName: 'Kigali Faces Agency',
  logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300', coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
  ceoName: 'Claudine Mukamana', licenseNumber: 'ARMA-LIC-2026-001', licensedStatus: 'Licensed',
  province: 'Kigali City', district: 'Nyarugenge', address: 'KN 5 Road, Kigali', website: 'https://example.org',
  email: 'hello@kigalifaces.example', phone: '+250 788 000 001',
  description: 'A licensed Kigali agency representing commercial, editorial, and runway talent.',
  representedModelsCount: 1, activeCastingsCount: 2, verified: true, featured: true
}];

export const INITIAL_SCOUTS: ScoutProfile[] = [];

export const INITIAL_CASTINGS: CastingCall[] = [{
  id: 'cast-001', title: 'Kigali Autumn Lookbook', organizerName: 'Kigali Faces Agency', organizerType: 'Agency',
  category: 'Editorial', location: 'Kigali', date: '2026-09-12', deadline: '2026-08-28', compensation: 'Paid; details on brief',
  description: 'Seeking confident editorial talent for a two-day studio and street-style lookbook production.',
  status: 'Open', applicantsCount: 0, featured: true, requirements: { gender: 'All', minHeightCm: 170, experienceLevel: 'Professional' }
}];

export const INITIAL_EVENTS: EventItem[] = [{
  id: 'evt-001', title: 'ARMA Industry Standards Forum', category: 'Seminar', startDate: '2026-09-05', endDate: '2026-09-05',
  location: 'Kigali', venue: 'Kigali Convention Centre', description: 'A practical forum on safeguarding, contracts, licensing, and professional standards across Rwanda’s fashion industry.',
  image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200', organizer: 'ARMA Secretariat', ticketPrice: 'Free registration', status: 'Upcoming', isFeatured: true
}];

export const INITIAL_NEWS: NewsItem[] = [{
  id: 'news-001', title: 'ARMA publishes 2026 agency licensing calendar', slug: '2026-agency-licensing-calendar', category: 'National Announcement',
  summary: 'Agencies can now review the annual licensing, renewal, and compliance review dates.',
  content: 'ARMA has published its 2026 licensing calendar to make renewal planning clearer for agencies and represented talent.',
  author: 'ARMA Secretariat', date: '2026-08-01', readTime: '3 min read', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200', featured: true
}];

export const INITIAL_DOCUMENTS: DocumentItem[] = [{
  id: 'doc-001', title: 'Model and Agency Code of Conduct', category: 'Code of Conduct', fileSize: '248 KB', fileFormat: 'PDF',
  uploadDate: '2026-01-15', downloadCount: 0, description: 'Professional conduct, safeguarding, representation, and reporting standards for ARMA members.',
  fileUrl: '/documents/arma-code-of-conduct.pdf'
}];

export const INITIAL_CERTIFICATES: CertificateItem[] = [{
  id: 'cert-001', certificateNumber: 'ARMA-CERT-2026-001', recipientName: 'Kigali Faces Agency', recipientRole: 'Licensed Agency',
  courseTitle: 'Agency Compliance and Safeguarding', issueDate: '2026-01-20', expiryDate: '2027-01-20', verified: true,
  qrCodeData: 'ARMA-CERT-2026-001', issuerName: 'ARMA Secretariat'
}];

export const LEADERSHIP_MEMBERS: Array<{
  name: string;
  role: string;
  contact?: string;
  bio: string;
  photo?: string;
}> = [
  { name: 'Claudine Mukamana', role: 'Chairperson, ARMA Secretariat', bio: 'Leads national coordination, licensing standards, and industry development.' },
  { name: 'Eric Habimana', role: 'Director of Standards and Safeguarding', bio: 'Oversees professional conduct, welfare, and safeguarding frameworks for members.' },
  { name: 'Diane Ingabire', role: 'Director of Membership and Partnerships', bio: 'Builds member services and partnerships across Rwanda’s creative economy.' }
];

export const DEMO_USER_ADMIN: User = {
  id: 'usr-admin',
  name: 'ARMA Secretariat System Administrator',
  email: 'admin@arma.org.rw',
  role: 'Admin',
  avatar: '',
  verified: true,
  memberId: 'ARMA-ADM-001',
  membershipLevel: 'Executive',
  createdAt: '2026-01-01'
};

export const DEMO_USER_MODEL: User = {
  id: 'usr-system',
  name: 'System User',
  email: 'system@arma.org.rw',
  role: 'Model',
  avatar: '',
  verified: true,
  memberId: 'ARMA-MOD-SYS',
  membershipLevel: 'General',
  createdAt: '2026-01-01'
};

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];
