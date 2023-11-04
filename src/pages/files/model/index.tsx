// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/files'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import Pagination from '@mui/material/Pagination'

import ImageRectangle from 'src/views/portal/ImageRectangle';


// ** Next Import
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'

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


const FileResourceModel = ({ activeTab } : any) => {

  const router = useRouter();

  const { id } = router.query;

  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 8 })
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.files)

  useEffect(() => {
    if(true) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: activeTab
        })
      )
    }
  }, [dispatch, paginationModel, activeTab])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/files/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChange", event, isLoading)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
          >
            <Tab
              value='png'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  Png
                </Box>
              }
            />
            <Tab
              value='jpeg'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:lock-outline' />
                  Jpeg
                </Box>
              }
            />
            <Tab
              value='mp4'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bookmark-outline' />
                  Mp4
                </Box>
              }
            />
            <Tab
              value='pdf'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Pdf
                </Box>
              }
            />
            <Tab
              value='office'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Office
                </Box>
              }
            />
            <Tab
              value='stl'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Stl
                </Box>
              }
            />
          </TabList>
        </TabContext>

        <Card sx={{ padding: '0 8px' }}>
          <CardHeader title={`${activeTab?.toUpperCase()} Resources`} />
          {store && store.data !== undefined ? (
            <Grid container spacing={2}>
              {store.data.map((item: TxRecordType, index: number) => (
                <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                  <ImageRectangle item={item} backEndApi={authConfig.backEndApi} FileType={activeTab}/>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Fragment></Fragment>
          )}
          <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
            <Pagination  count={Number(store.allPages)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} />
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default FileResourceModel
