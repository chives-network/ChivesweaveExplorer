// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/transactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatStorageSize, formatTimestampAge } from 'src/configs/functions';

import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';

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
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
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


const TransactionList = () => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const paginationModelDefaultValue = { page: 0, pageSize: 15 }
  const [paginationModel, setPaginationModel] = useState(paginationModelDefaultValue)  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page:page-1 });
    console.log("handlePageChange", event)
  }  
  const isMobileData = isMobile()

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transactions)

  useEffect(() => {
    dispatch(
      fetchData({
        pageId: paginationModel.page,
        pageSize: paginationModel.pageSize
      })
    )
  }, [dispatch, paginationModel])

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
            <Tooltip title={`${row.id}`}>
              <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 7)}</LinkStyled>
            </Tooltip>
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
            <Tooltip title={`${row.owner.address}`}>
              <LinkStyled href={`/addresses/all/${row.owner.address}`}>{formatHash(row.owner.address, 7)}</LinkStyled>
            </Tooltip>
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
            {parseTxFeeAndBundleId(row)}
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
    <Fragment>
        {isMobileData ? 
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t('Transactions')}`} sx={{ px: 5, py: 3 }}/>          
            </Card>
          </Grid>
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
                              <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                              {`${t(`From`)}`}：<StringDisplay InputString={`${row.owner.address}`} StringSize={7} href={`/addresses/all/${row.owner.address}`}/>
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
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Transactions`)}`} />
              <Divider />
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
          </Grid>
        </Grid>
        }
      </Fragment>
  )
}

export default TransactionList
