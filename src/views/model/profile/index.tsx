// ** React Imports
import { Fragment, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import Icon from 'src/@core/components/icon'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import Profile from 'src/views/model/profile/profile';
import MyAgent from 'src/views/model/profile/myagent';

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

const ProfileIndex = ({ activeTab } : any) => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()
  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/profile/${value.toLowerCase()}`
      })
    console.log("handleChangeEvent", event)
  }
  
  return (
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <TabContext value={activeTab}>
            <TabList
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='forced scroll tabs example'
            >
                <Tab
                value='profile'
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                    <Icon fontSize={20} icon='mingcute:profile-line' />
                    {`${t(`Profile`)}`}
                    </Box>
                }
                />
                <Tab
                value='myagent'
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                    <Icon fontSize={20} icon='material-symbols:support-agent' />
                    {`${t(`My Agent`)}`}
                    </Box>
                }
                />
            </TabList>
            </TabContext>
            {activeTab == "profile" ?
                <Card>
                <CardContent>
                    <Profile />
                </CardContent>
                </Card>
            :
                <Fragment></Fragment>
            }
            {activeTab == "myagent" ?
                <Card>
                <CardContent>
                    <MyAgent />
                </CardContent>
                </Card>
            :
                <Fragment></Fragment>
            }
        </Grid>
      </Grid>
  )
}

export default ProfileIndex
