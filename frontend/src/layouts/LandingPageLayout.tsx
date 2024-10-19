// src/layouts/LandingPageLayout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Modal from '../components/Modal';
import EmailVerificationReminder from '../components/EmailVerificationReminder';

import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';

const LandingPageLayout: React.FC = () => {
  const { isModalOpen, modalContent, closeModal } = useModal();
  const { user, justRegistered, clearJustRegistered } = useAuth();

  useEffect(() => {
    return () => {
      if (justRegistered) {
        clearJustRegistered();
      }
    };
  }, [justRegistered, clearJustRegistered]);

  return (
    <div className="landing-page-layout">
      <Header />
      {justRegistered && user && !user.isVerified && <EmailVerificationReminder />}
      <main className="content">
        <Outlet />
      </main>
      <Footer />
      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default LandingPageLayout;