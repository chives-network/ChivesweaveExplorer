export default {
  backEndApi: 'https://api.chivesweave.net:1986',
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  systemType: 'drive',
  chivesWallets: 'ChivesWallets',
  chivesCurrentWallet: 'ChivesCurrentWallet'
}
