import { z } from 'zod';
import { adminOAuthProviderSchema, adminOAuthProviderUpdateSchema } from '@/lib/schemas/admin/oauthProviders.ts';

type OAuthFormValues = z.infer<typeof adminOAuthProviderUpdateSchema>;

export const oauthProviderEmptyFormValues: OAuthFormValues = {
  name: '',
  description: null,
  clientId: '',
  clientSecret: '',
  authUrl: '',
  tokenUrl: '',
  infoUrl: '',
  scopes: [],
  identifierPath: '',
  emailPath: null,
  usernamePath: null,
  nameFirstPath: null,
  nameLastPath: null,
  enabled: true,
  loginOnly: false,
  loginBypassTwoFactor: false,
  linkViewable: true,
  userManageable: true,
  basicAuth: false,
};

export const oauthProviderToFormValues = (
  provider: z.infer<typeof adminOAuthProviderSchema>,
): Partial<OAuthFormValues> => ({
  name: provider.name,
  description: provider.description,
  clientId: provider.clientId,
  clientSecret: provider.clientSecret,
  authUrl: provider.authUrl,
  tokenUrl: provider.tokenUrl,
  infoUrl: provider.infoUrl,
  scopes: provider.scopes,
  identifierPath: provider.identifierPath,
  emailPath: provider.emailPath,
  usernamePath: provider.usernamePath,
  nameFirstPath: provider.nameFirstPath,
  nameLastPath: provider.nameLastPath,
  enabled: provider.enabled,
  loginOnly: provider.loginOnly,
  loginBypassTwoFactor: provider.loginBypassTwoFactor,
  linkViewable: provider.linkViewable,
  userManageable: provider.userManageable,
  basicAuth: provider.basicAuth,
});
