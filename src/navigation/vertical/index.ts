// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
      title: 'Ecosystem',
      icon: 'icon-park-outline:system',
      path: '/ecosystem'
    }
  ]
}

export default navigation
