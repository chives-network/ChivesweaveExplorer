// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Tooltip from '@mui/material/Tooltip'
import TableContainer from '@mui/material/TableContainer'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/addresstransactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize } from 'src/configs/functions';

import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';

// ** Next Import
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import Pagination from '@mui/material/Pagination'
import StringDisplay from 'src/pages/preview/StringDisplay'

interface TransactionCellType {
  row: TxRecordType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 550,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

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

const LinkStyledNormal = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const AddressTransactionListModel = ({ activeTab } : any) => {
  // ** Hook
  const { t } = useTranslation()
  
  const router = useRouter()
  const { id } = router.query

  const paginationModelDefaultValue = { page: 0, pageSize: 15 }
  const [paginationModel, setPaginationModel] = useState(paginationModelDefaultValue)  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page:page-1 });
    console.log("handlePageChange", event)
  }  
  const isMobileData = isMobile()

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.addresstransactions)

  const [addressBalance, setAddressBalance] = useState<number>(0)

  useEffect(() => {
    if(id != undefined) {
      axios
        .get(authConfig.backEndApi + '/wallet/' + id + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  useEffect(() => {
    if(id!=undefined) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize,
          type: activeTab
        })
      )
    }
  }, [dispatch, paginationModel, id, activeTab])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/addresses/${value.toLowerCase()}/${id}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChangeEvent", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  function parseTxFeeAndBundleId(TxRecord: TxRecordType) {
    if(TxRecord.bundleid && TxRecord.bundleid!="") {
    
      return (
        <Tooltip title={`BundleId: ${TxRecord.bundleid}`}>
          <LinkStyledNormal href={`/txs/view/${TxRecord.bundleid}`}>{formatHash(TxRecord.bundleid, 5)}</LinkStyledNormal>
        </Tooltip>
      )
    }
  
    return formatXWE(TxRecord.fee.winston, 6);
  }

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'TxId',
      headerName: `${t(`TxId`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 7)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'From',
      headerName: `${t(`From`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/addresses/all/${row.owner.address}`}>{formatHash(row.owner.address, 7)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerName: `${t(`Size`)}`,
      field: 'Size',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatStorageSize(row.data.size)}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Fee',
      headerName: `${t(`Fee`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatXWE(row.fee.winston, 6)}
          </Typography>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'Info',
      headerName: `${t(`Info`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <FormatTxInfoInRow TxRecord={row}/>
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'Height',
      headerName: `${t(`Height`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/blocks/view/${row.block.height}`}>{row.block.height}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'Time',
      minWidth: 220,
      headerName: `${t(`Time`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatTimestampAge(row.block.timestamp)}
          </Typography>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`Address`)}`} />
          <CardContent>
            <Grid container spacing={6}>

              <Grid item xs={12} lg={12}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Address`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {id && id.length == 43 ?
                            <Fragment>                              
                              {isMobileData == true ?
                                <StringDisplay InputString={String(id)} StringSize={12} href={null}/>
                                :
                                <StringDisplay InputString={String(id)} StringSize={25} href={null}/>
                              }
                            </Fragment>
                            :
                            <Fragment>{`${t(`No Address`)}`}</Fragment>
                          }
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            {`${t(`Balance`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{formatXWE(addressBalance, 8)} XWE</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            {`${t(`Total transactions`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{store.total}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>
          </CardContent>

        </Card>
      </Grid>
    :
      <Fragment></Fragment>
    }

    
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
          >
            <Tab
              value='all'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='ant-design:transaction-outlined' />
                  {`${t(`All`)}`}
                </Box>
              }
            />
            <Tab
              value='sent'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:receipt-text-arrow-right' />
                  {`${t(`Sent`)}`}
                </Box>
              }
            />
            <Tab
              value='received'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:receipt-text-arrow-left' />
                  {`${t(`Received`)}`}
                </Box>
              }
            />
            <Tab
              value='files'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:file-multiple' />
                  {`${t(`Files`)}`}
                </Box>
              }
            />
          </TabList>
        </TabContext>

        {isMobileData ? 
        <Grid container spacing={6}>
          {store.data.map((row: any, index: number) => {
            return (
              <Grid item xs={12} sx={{ py: 0 }} key={index}>
                <Card>
                  <CardContent>      
                    <TableContainer>
                      <Table size='small' sx={{ width: '95%' }}>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 0,
                              pb: 1.5,
                              pl: '0 !important',
                              pr: '0 !important',
                              '&:first-of-type': {
                                width: 148
                              }
                            }
                          }}
                        >
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                              {`${t(`TxId`)}`}：<StringDisplay InputString={`${row.id}`} StringSize={7} href={`/txs/view/${row.id}`}/>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Size`)}`}：{formatStorageSize(row.data.size)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Fee`)}`}：{parseTxFeeAndBundleId(row)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                              {`${t(`Info`)}`}：<FormatTxInfoInRow TxRecord={row}/>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                              {`${t(`Height`)}`}：<StringDisplay InputString={`${row.block.height}`} StringSize={7} href={`/blocks/view/${row.block.height}`}/>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Time`)}`}：{formatTimestampAge(row.block.timestamp)}
                              </Typography>
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>      
                </Card>
              </Grid>
            )
          })}
          <Box sx={{ pl: 5, py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                <Pagination count={Math.ceil(store.total/paginationModel.pageSize)} variant='outlined' color='primary' page={paginationModel.page+1} onChange={handlePageChange} siblingCount={1} boundaryCount={1} />
              </Grid>
            </Box>
          </Box>
        </Grid>
        :
        <Card>
          <CardHeader title={`${t(`Transactions`)}`} />
          {store && store.data != undefined ?
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
          :
            <Fragment></Fragment>
          }
        </Card>        
        }
      </Grid>
    </Grid>
  )
}


export default AddressTransactionListModel
