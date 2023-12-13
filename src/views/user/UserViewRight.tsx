// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
// ** import UserViewBilling from 'src/views/user/UserViewBilling'
// ** import UserViewOverview from 'src/views/user/UserViewOverview'
// ** import UserViewSecurity from 'src/views/user/UserViewSecurity'
// ** import UserViewConnection from 'src/views/user/UserViewConnection'
// ** import UserViewNotification from 'src/views/user/UserViewNotification'
import UserAgentMembers from 'src/views/user/UserAgentMembers'
import UserViewReward from 'src/views/user/UserViewReward'
import UserViewSubscribe from 'src/views/user/UserViewSubscribe'
import UserViewProject from 'src/views/user/UserViewProject'

interface Props {
  tab: string
  address: string
}

// ** Styled Tab component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))

const UserViewRight = ({ tab, address }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  console.log("isLoading", isLoading)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/user/${value.toLowerCase()}/${address}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        <Tab
          value='agent'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:account-outline' />
              Agent
            </Box>
          }
        />
        <Tab
          value='reward'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:lock-outline' />
              Reward
            </Box>
          }
        />
        <Tab
          value='subscribe'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bookmark-outline' />
              Subscribe
            </Box>
          }
        />
        <Tab
          value='project'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bell-outline' />
              Project
            </Box>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <TabPanel sx={{ p: 0 }} value='agent'>
          <UserAgentMembers />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='reward'>
          <UserViewReward />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='subscribe'>
          <UserViewSubscribe />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='project'>
          <UserViewProject />
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default UserViewRight
