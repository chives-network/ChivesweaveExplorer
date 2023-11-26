export default {
  backEndApi: 'https://api.chivesweave.net:1986',
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  systemType: 'explorer',
  chivesWallets: 'ChivesWallets',
  chivesCurrentWallet: 'ChivesCurrentWallet',
  chivesWalletNickname: 'ChivesWalletNickname',
  chivesDriveActions: 'ChivesDriveActions',
  'App-Name': 'ChivesDrive',
  'App-Platform': 'web',
  'App-Version': '0.1'
}