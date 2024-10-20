// src/pages/SiteSettingsAdmin.tsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';

const SiteSettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get<ApiResponse<SiteSettings>>('/site-settings');
        setSettings(response.data.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put<ApiResponse<SiteSettings>>('/site-settings', settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSocialMediaChange = (platform: 'facebook' | 'twitter' | 'instagram') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => prev ? {
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: e.target.value
      }
    } : null);
  };

  if (loading) return <LoadingSpinner />;
  if (!settings) return <p className="text-red-500">Failed to load settings</p>;

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-5">Site Settings</h1>
      {error && <p className="text-red-500 mb-5">{error}</p>}
      {success && <p className="text-green-500 mb-5">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="siteName" className="block mb-1 font-semibold">Site Name</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="siteDescription" className="block mb-1 font-semibold">Site Description</label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="siteKeywords" className="block mb-1 font-semibold">Site Keywords (comma-separated)</label>
          <input
            type="text"
            id="siteKeywords"
            name="siteKeywords"
            value={settings.siteKeywords.join(', ')}
            onChange={(e) => setSettings(prev => prev ? { ...prev, siteKeywords: e.target.value.split(',').map(k => k.trim()) } : null)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="logoUrl" className="block mb-1 font-semibold">Logo URL</label>
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            value={settings.logoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Social Media Links</h2>
        <div>
          <label htmlFor="facebook" className="block mb-1 font-semibold">Facebook</label>
          <input
            type="text"
            id="facebook"
            name="socialMediaLinks.facebook"
            value={settings.socialMediaLinks.facebook || ''}
            onChange={handleSocialMediaChange('facebook')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="twitter" className="block mb-1 font-semibold">Twitter</label>
          <input
            type="text"
            id="twitter"
            name="socialMediaLinks.twitter"
            value={settings.socialMediaLinks.twitter || ''}
            onChange={handleSocialMediaChange('twitter')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="instagram" className="block mb-1 font-semibold">Instagram</label>
          <input
            type="text"
            id="instagram"
            name="socialMediaLinks.instagram"
            value={settings.socialMediaLinks.instagram || ''}
            onChange={handleSocialMediaChange('instagram')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SiteSettingsAdmin;