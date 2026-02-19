const OAuthProviderType = {
  CUSTOM: 'custom',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
} as const;

const AvailableOAuthProviders = Object.values(OAuthProviderType);

export { AvailableOAuthProviders, OAuthProviderType };
