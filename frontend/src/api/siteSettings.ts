// src/api/siteSettings.ts
import apiClient from './client';

export const getSiteSettings = async (): Promise<ApiResponse<SiteSettings>> => {
  const response = await apiClient.get<ApiResponse<SiteSettings>>('/site-settings');
  return response.data;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<ApiResponse<SiteSettings>> => {
  const response = await apiClient.put<ApiResponse<SiteSettings>>('/site-settings', settings);
  return response.data;
};

export const updateSEOSettings = async (seoSettings: Pick<SiteSettings, 'siteName' | 'siteDescription' | 'siteKeywords'>): Promise<ApiResponse<SiteSettings>> => {
  const response = await apiClient.put<ApiResponse<SiteSettings>>('/site-settings/seo', seoSettings);
  return response.data;
};

export const updateSocialMediaLinks = async (socialMediaLinks: SiteSettings['socialMediaLinks']): Promise<ApiResponse<SiteSettings>> => {
  const response = await apiClient.put<ApiResponse<SiteSettings>>('/site-settings/social-media', { socialMediaLinks });
  return response.data;
};

export const updateLogo = async (logoUrl: string): Promise<ApiResponse<SiteSettings>> => {
  const response = await apiClient.put<ApiResponse<SiteSettings>>('/site-settings/logo', { logoUrl });
  return response.data;
};