export type UserRole = 
  | 'Model'
  | 'Agency'
  | 'Scout'
  | 'Fashion Organization'
  | 'Brand'
  | 'Photographer'
  | 'Makeup Artist'
  | 'Event Organizer'
  | 'Admin';

export type MembershipLevel = 'General' | 'Professional' | 'Licensed Agency' | 'Honorary' | 'Executive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
  emailVerified?: boolean;
  emailVerificationCode?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaRecoveryCodes?: string[];
  memberId: string;
  membershipLevel: MembershipLevel;
  phone?: string;
  location?: string;
  agencyId?: string;
  createdAt: string;
}

export interface Measurements {
  heightCm: number;
  weightKg?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  shoeSizeEu: number;
  hairColor: string;
  eyeColor: string;
  skinTone?: string;
}

export interface ModelProfile {
  id: string;
  userId: string;
  fullName: string;
  stageName?: string;
  category: 'High Fashion' | 'Commercial' | 'Runway' | 'Fitness' | 'Editorial' | 'Plus Size' | 'Petite';
  gender: 'Female' | 'Male' | 'Non-Binary';
  agencyId?: string;
  agencyName?: string;
  province: 'Kigali City' | 'Northern Province' | 'Southern Province' | 'Eastern Province' | 'Western Province';
  district: string;
  photos: {
    headshot: string;
    fullBody: string;
    runway?: string;
    editorial?: string;
    commercial?: string;
    gallery: string[];
  };
  measurements: Measurements;
  nationality: string;
  languages: string[];
  experienceYears: number;
  bio: string;
  achievements: string[];
  socials: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    website?: string;
  };
  availability: 'Available' | 'On Contract' | 'Booked' | 'Inactive';
  verifiedBadge: boolean;
  featured: boolean;
  rating: number;
  compCardUrl?: string;
}

export interface AgencyProfile {
  id: string;
  userId: string;
  agencyName: string;
  logo: string;
  coverImage: string;
  ceoName: string;
  licenseNumber: string;
  licensedStatus: 'Licensed' | 'Pending Renewal' | 'Provisionary' | 'Under Review' | 'Suspended';
  province: string;
  district: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  representedModelsCount: number;
  activeCastingsCount: number;
  verified: boolean;
  featured: boolean;
  ceoQuestions?: {
    operatingYears: string;
    welfarePolicies: string;
    primaryFocus: string;
  };
}

export interface ScoutProfile {
  id: string;
  userId: string;
  fullName: string;
  photo: string;
  scoutCode: string;
  certified: boolean;
  agencyAffiliation?: string;
  discoveredModelsCount: number;
  province: string;
  phone: string;
  email: string;
  bio: string;
}

export interface CastingCall {
  id: string;
  title: string;
  organizerName: string;
  organizerType: 'Agency' | 'Brand' | 'Event Organizer' | 'Production House';
  category: string;
  location: string;
  date: string;
  deadline: string;
  compensation: string;
  description: string;
  bannerImage?: string;
  image?: string;
  requirements: {
    gender?: 'All' | 'Female' | 'Male';
    minHeightCm?: number;
    ageRange?: string;
    experienceLevel?: string;
  };
  status: 'Open' | 'Closed' | 'Draft';
  applicantsCount: number;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Fashion Week' | 'Casting' | 'Competition' | 'Training' | 'Seminar' | 'Workshop';
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  description: string;
  image: string;
  organizer: string;
  ticketPrice?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  isFeatured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'National Announcement' | 'Industry Insights' | 'Event Highlights' | 'Member Focus';
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Constitution' | 'Policies' | 'Code of Conduct' | 'Forms' | 'Guidelines' | 'Security & Privacy';
  fileSize: string;
  fileFormat: string;
  uploadDate: string;
  downloadCount: number;
  description: string;
  fileUrl: string;
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientRole: string;
  courseTitle: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  qrCodeData: string;
  issuerName: string;
}

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  province: string;
  district: string;
  nationalId: string;
  portfolioLink?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  notes?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  frequency: 'Weekly Gazette' | 'Instant Casting Alerts' | 'Monthly Digest';
  topics: string[];
  status: 'Active' | 'Unsubscribed';
  welcomeEmailSent: boolean;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  agencyName: string;
  agencyId: string;
  subject: string;
  previousStatus: string;
  newStatus?: string;
  sentAt: string;
  sentBy: string;
  reasonNote?: string;
  bodyHtml: string;
  read: boolean;
}
