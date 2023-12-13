// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import axios from 'axios'

// ** Type Imports
import { ProjectListDataType } from 'src/types/apps/userTypes'

// ** Store 
import { useDispatch, useSelector } from 'react-redux'
import { fetchAgentMembersData } from 'src/store/apps/agent'
import { RootState, AppDispatch } from 'src/store'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import authConfig from 'src/configs/auth'
import { formatTimestampAge } from 'src/configs/functions'

// ** Next Import
import { useRouter } from 'next/router'

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

const UserAgentMembersListTable = () => {
  // ** Hook
  const { t } = useTranslation()
  
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [value, setValue] = useState<string>('')
  const [data, setData] = useState<ProjectListDataType[]>([])

  console.log("datadatadata",data)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.agent)

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const paginationModelDefaultValue = { page: 0, pageSize: 15 }
  const [paginationModel, setPaginationModel] = useState(paginationModelDefaultValue)  

  const isMobileData = isMobile()

  console.log("isMobileData", isMobileData)

  useEffect(() => {
    console.log("paginationModel", paginationModel)
    if(id != undefined) {
      setValue("")
      dispatch(
        fetchAgentMembersData({
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize,
          address: String(id)
        })
      )
    }
  }, [dispatch, paginationModel, id])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    axios
      .get('/apps/users/project-list', {
        params: {
          q: value
        }
      })
      .then(res => setData(res.data))
  }, [value])

  const columns = [
    {
      flex: 0.3,
      minWidth: 160,
      field: `${t('Name')}`,
      headerName: `${t('Name')}`,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Img src={(row && row.Profile && row.Profile.Avatar && row.Profile.Avatar.length == 43) ? `${authConfig.backEndApi}/${row.Profile.Avatar}/thumbnail` : '/images/chives.png' } />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
              {row.Profile && row.Profile.Name ? row.Profile.Name : t('Not Setting') }
            </Typography>
            <Typography variant='caption'>{row.projectType}</Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.3,
      minWidth: 160,
      field: `${t('Twitter')}`,
      headerName: `${t('Twitter')}`,
      renderCell: ({ row }: any) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {row.Profile && row.Profile.Twitter ? row.Profile.Twitter : "" }
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 50,
      field: `${t('Time')}`,
      headerName: `${t('Time')}`,
      renderCell: ({ row }: any) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {row.Block && row.Block.timestamp ? formatTimestampAge(row.Block.timestamp) : "" }
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={`${t('Agent Members')}`} />
      <DataGrid
        autoHeight
        rows={store.data}
        rowCount={store.total as number}
        columns={columns}
        sortingMode='server'
        paginationMode='server'
        filterMode="server"
        loading={isLoading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 15, 20, 30, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableColumnMenu={true}
        />
    </Card>
  )
}

export default UserAgentMembersListTable
