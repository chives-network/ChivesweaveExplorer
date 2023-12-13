// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

import authConfig from 'src/configs/auth'

const ExplorerNavMenus = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/overview'
  },
  {
    sectionTitle: 'Blocks & Txs'
  },
  {
    title: 'Blocks',
    icon: 'clarity:blocks-group-line',
    path: '/blocks'
  },
  {
    title: 'Transactions',
    icon: 'grommet-icons:transaction',
    path: '/txs'
  },
  {
    title: 'Addresses',
    icon: 'clarity:wallet-solid',
    path: '/addresses'
  },
  {
    title: 'Resoures',
    icon: 'mdi:file-multiple',
    path: '/files/image'
  },
  {
    title: 'Staticstics',
    icon: 'mdi:chart-areaspline',
    path: '/statics'
  },
  {
    title: 'Top Stats',
    icon: 'mdi:poll',
    path: '/topstats'
  },
  {
    title: 'Nodes',
    icon: 'fa6-solid:share-nodes',
    path: '/nodes'
  },
  {
    title: 'Memory Pool',
    icon: 'mdi:pool',
    path: '/mempool'
  }
]

const DriveNavMenus = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/overview'
  },
  {
    sectionTitle: 'My Portal'
  },
  {
    title: 'Resources',
    icon: 'material-symbols:captive-portal-rounded',
    path: '/files/image'
  },
  {
    title: 'My Drive',
    icon: 'streamline:hard-disk-solid',
    path: '/drive'
  },
  {
    title: 'My Wallet',
    icon: 'clarity:wallet-solid',
    path: '/wallet'
  },
  {
    title: 'My Files',
    icon: 'mdi:file-multiple',
    path: '/myfiles'
  },
  {
    sectionTitle: 'Task To Earn'
  },
  {
    title: 'Introduction',
    icon: 'material-symbols:article',
    path: '/task/introduction'
  },
  {
    title: 'Task List',
    icon: 'material-symbols:calendar-today',
    path: '/task/list'
  },
  {
    title: 'My Task',
    icon: 'material-symbols:today-rounded',
    path: '/task/my'
  },
  {
    title: 'Agent',
    icon: 'material-symbols:support-agent',
    path: '/agent/all'
  },
  {
    sectionTitle: 'Blockchain'
  },
  {
    title: 'Blocks',
    icon: 'clarity:blocks-group-line',
    path: '/blocks'
  },
  {
    title: 'Transactions',
    icon: 'grommet-icons:transaction',
    path: '/txs'
  },
  {
    title: 'Addresses',
    icon: 'clarity:wallet-solid',
    path: '/addresses'
  },
  {
    title: 'Nodes',
    icon: 'fa6-solid:share-nodes',
    path: '/nodes'
  },
  {
    title: 'Memory Pool',
    icon: 'mdi:pool',
    path: '/mempool'
  }
]

const navigation = (): VerticalNavItemsType => {

  // @ts-ignore
  return authConfig.systemType == "drive" ? DriveNavMenus : ExplorerNavMenus
}

export default navigation
