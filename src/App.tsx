import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { Helmet } from './components/seo/Helmet';

import { HeroSection } from './components/home/HeroSection';
import { StatsCounter } from './components/home/StatsCounter';
import { AboutSection } from './components/home/AboutSection';
import { FeaturedModels } from './components/home/FeaturedModels';
import { MembershipCategories } from './components/home/MembershipCategories';
import { LatestNews } from './components/home/LatestNews';
import { PartnersCarousel } from './components/home/PartnersCarousel';

import { DirectoryPage } from './components/directory/DirectoryPage';
import { CastingsPage } from './components/castings/CastingsPage';
import { EventsPage } from './components/events/EventsPage';
import { MembershipPage } from './components/membership/MembershipPage';
import { CertificationPage } from './components/certification/CertificationPage';
import { DocumentsPage } from './components/documents/DocumentsPage';
import { NewsPage } from './components/news/NewsPage';
import { LeadershipPage } from './components/about/LeadershipPage';
import { ContactPage } from './components/contact/ContactPage';
import { SecurityTermsPage } from './components/security/SecurityTermsPage';

import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { AuthModal } from './components/auth/AuthModal';
import { ModelProfileModal } from './components/models/ModelProfileModal';
import { AgencyProfileModal } from './components/agencies/AgencyProfileModal';

const PAGE_SEO_MAP: Record<string, { title: string; description: string; keywords?: string }> = {
  home: {
    title: 'Official Rwanda Models & Agencies Platform | ARMA Rwanda',
    description: 'Official National Association of Rwanda Models & Agencies (ARMA). Discover verified runway models, licensed agencies, fashion casting calls, and digital certification.',
    keywords: 'ARMA Rwanda, Rwanda Modeling Association, Kigali Fashion, African Models, Runway Castings, Modeling Agency Licensing'
  },
  directory: {
    title: 'Model & Agency Verified National Directory | ARMA Rwanda',
    description: 'Browse Rwanda\'s accredited fashion models, certified agencies, talent scouts, and fashion photographers in the official ARMA National Talent Directory.',
    keywords: 'Rwanda Model Directory, Kigali Modeling Agencies, Scout Talent Rwanda, Accredited Models Kigali'
  },
  castings: {
    title: 'Fashion Casting Calls & Runway Auditions | ARMA Rwanda',
    description: 'Apply for verified fashion runway casting calls, commercial modeling auditions, international scoutings, and brand campaigns across Rwanda.',
    keywords: 'Casting Calls Rwanda, Kigali Fashion Show Auditions, Model Jobs Kigali, Commercial Model Casting'
  },
  events: {
    title: 'Fashion Events & Masterclasses Calendar | ARMA Rwanda',
    description: 'Upcoming runway presentations, fashion week schedules, model workshops, and ARMA industry masterclasses in Kigali and East Africa.',
    keywords: 'Kigali Fashion Week, Fashion Events Rwanda, Runway Masterclass Kigali, ARMA Gala'
  },
  membership: {
    title: 'Official Membership & Accreditation | ARMA Rwanda',
    description: 'Join ARMA as a professional model, agency, or corporate partner. Gain digital ID licensing, safeguarding legal tools, and official recognition.',
    keywords: 'Join ARMA, Model License Rwanda, Agency Accreditation Kigali, Fashion Association Membership'
  },
  certification: {
    title: 'Digital ID License Verification & QR Check | ARMA Rwanda',
    description: 'Instantly verify official ARMA Rwanda digital model badges, licensed agency credentials, and official QR-code identity accreditation.',
    keywords: 'Model Digital ID, Verify Agency License, ARMA Badge Check, Rwanda Fashion Accreditation'
  },
  documents: {
    title: 'Regulatory Bylaws & Legal Framework Documents | ARMA Rwanda',
    description: 'Download official ARMA legal frameworks, model safeguarding bylaws, agency code of conduct, and standard representation contracts.',
    keywords: 'ARMA Bylaws, Modeling Contracts Rwanda, Talent Safeguarding Rules, Agency Code of Conduct'
  },
  news: {
    title: 'Industry News & Official Announcements | ARMA Rwanda',
    description: 'Latest news, runway highlights, agency press releases, international modeling features, and national fashion updates from ARMA Rwanda.',
    keywords: 'Rwanda Fashion News, ARMA Press Releases, Kigali Model Features, African Runway Updates'
  },
  about: {
    title: 'Executive Leadership Board & Secretariat | ARMA Rwanda',
    description: 'Learn about the African Rwanda Modeling Association board, mission, regulatory standards, ethical oversight, and fashion industry vision.',
    keywords: 'ARMA Board, Rwanda Fashion Leadership, Secretariat Kigali, Modeling Governance'
  },
  contact: {
    title: 'Contact Secretariat & Legal Safeguarding Desk | ARMA Rwanda',
    description: 'Reach out to the ARMA Kigali Secretariat for membership inquiries, agency licensing support, or confidential safeguarding assistance.',
    keywords: 'Contact ARMA, Kigali Secretariat Phone, Safeguarding Helpline, Modeling Support Rwanda'
  },
  security: {
    title: 'Cyber Security & Platform Controls | ARMA Rwanda',
    description: 'Discover ARMA\'s 11-point cyber security suite: MFA, AES-256 contract encryption, multi-tenant agency data isolation, and audit logging.',
    keywords: 'ARMA Cyber Security, Agency Data Isolation, Encrypted Modeling Contracts, Super Admin MFA'
  },
  terms: {
    title: 'Terms of Service & Licensing Regulations | ARMA Rwanda',
    description: 'Official ARMA Terms of Service governing model representation, agency licensing compliance, and platform usage in Rwanda.',
    keywords: 'ARMA Terms of Service, Modeling Regulations Rwanda, Agency Compliance Rules'
  },
  privacy: {
    title: 'Data Privacy & Talent Safeguarding Policy | ARMA Rwanda',
    description: 'Read ARMA\'s data privacy protection policy, talent image rights guarantees, and GDPR-compliant secure data processing standards.',
    keywords: 'ARMA Privacy Policy, Talent Image Rights, GDPR Compliance Rwanda, Model Data Safeguards'
  },
  safeguarding: {
    title: 'Model Safeguarding & Anti-Exploitation Policy | ARMA Rwanda',
    description: 'ARMA strict zero-tolerance policy on talent exploitation, minor protection frameworks, fair pay standards, and confidential reporting.',
    keywords: 'Model Protection Rwanda, Anti-Exploitation Policy, Minor Model Safeguards, Fair Commission Cap'
  },
  dashboard: {
    title: 'Member Portal & Digital Portfolio Dashboard | ARMA Rwanda',
    description: 'Manage your ARMA digital portfolio, casting applications, agency bookings, digital ID card, and verified accreditation status.',
    keywords: 'ARMA Portal Dashboard, Model Profile Management, Agency Portal Rwanda'
  },
  admin: {
    title: 'Secretariat Super Admin & Cyber Control Center | ARMA Rwanda',
    description: 'ARMA Secretariat administrative control panel for agency vetting, document issuance, security audit logs, and compliance enforcement.',
    keywords: 'ARMA Admin Dashboard, Secretariat Control Center, Agency Licensing Audit'
  }
};

function MainApp() {
  const { selectedModelModal, setSelectedModelModal, selectedAgencyModal, setSelectedAgencyModal } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const currentSeo = PAGE_SEO_MAP[currentTab] || PAGE_SEO_MAP['home'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#12161A] text-slate-900 dark:text-white flex flex-col font-sans transition-colors selection:bg-[#00A1DE] selection:text-white">
      {/* Helmet Dynamic Document Title & SEO Meta Tags */}
      <Helmet
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
      />

      {/* Toast Overlay */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Router with Framer Motion Section Transitions */}
      <main className="flex-1 overflow-x-hidden pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          >
            {currentTab === 'home' && (
              <>
                <HeroSection
                  setCurrentTab={setCurrentTab}
                  openAuthModal={() => setAuthModalOpen(true)}
                />
                <StatsCounter />
                <AboutSection />
                <FeaturedModels setCurrentTab={setCurrentTab} />
                <MembershipCategories setCurrentTab={setCurrentTab} />
                <LatestNews setCurrentTab={setCurrentTab} />
                <PartnersCarousel />
              </>
            )}

            {currentTab === 'directory' && <DirectoryPage />}
            {currentTab === 'castings' && <CastingsPage />}
            {currentTab === 'events' && <EventsPage />}
            {currentTab === 'membership' && <MembershipPage />}
            {currentTab === 'certification' && <CertificationPage />}
            {currentTab === 'documents' && <DocumentsPage />}
            {currentTab === 'news' && <NewsPage />}
            {currentTab === 'about' && <LeadershipPage />}
            {currentTab === 'contact' && <ContactPage />}
            {currentTab === 'security' && <SecurityTermsPage initialSection="security" />}
            {currentTab === 'terms' && <SecurityTermsPage initialSection="terms" />}
            {currentTab === 'privacy' && <SecurityTermsPage initialSection="privacy" />}
            {currentTab === 'safeguarding' && <SecurityTermsPage initialSection="safeguarding" />}

            {currentTab === 'dashboard' && <UserDashboard />}
            {currentTab === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setAuthModalOpen(false)}
        />
      )}

      {/* Model Profile Modal */}
      {selectedModelModal && (
        <ModelProfileModal
          model={selectedModelModal}
          onClose={() => setSelectedModelModal(null)}
        />
      )}

      {/* Agency Profile Modal */}
      {selectedAgencyModal && (
        <AgencyProfileModal
          agency={selectedAgencyModal}
          onClose={() => setSelectedAgencyModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
