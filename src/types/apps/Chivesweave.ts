
// ** Types
import { Dispatch } from 'redux'

export type DriveLabelType = 'Png' | 'Jpeg' | 'Mp4' | 'Office' | 'Mp4' | 'Stl'

export type DriveFolderType = 'myfiles' | 'shared' | 'draft' | 'starred' | 'spam' | 'trash'

export type RouteParams = {
  label?: string
  initFolder?: string
  type?: string
}

export type DriveSidebarType = {
  hidden: boolean
  store: any
  lgAbove: boolean
  handleFolderHeaderList: (val: any) => void
  dispatch: Dispatch<any>
  routeParams: RouteParams
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  driveFileOpen: boolean
  uploadFilesTitle: string
  toggleUploadFilesOpen: () => void
  handleLeftSidebarToggle: () => void
  setFileDetailOpen: (val: boolean) => void
  handleSelectAllFile: (val: boolean) => void
}

export type BlockType = {
  id: number
  height: number
  weave_size: number
  txs_length: number
  timestamp: number
  reward_addr: string
  reward: number
  mining_time: number
  indep_hash: string
  block_size: number
}

export type TransactionType = {
  id: string
  block_indep_hash: string
  last_tx: string
  owner: string
  from_address: string
  target: string
  quantity: number
  signature: string
  reward: number
  timestamp: number
  block_height: number
  data_size: number
  bundleid: string
}

export type AddressType = {
  txs: number
  timestamp: number
  sent: number
  received: number
  lastblock: number
  id: string
  balance: number
}

export type TxRecordType = {
  id: string
  owner: {[key: string]: string}
  data: {[key: string]: any}
  fee: {[key: string]: number}
  quantity: {[key: string]: number}
  location: string
  recentActivity: string
  tags: any
  recipient: string
  block: {[key: string]: any}
  bundleid: string
  table: any
}
