// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import StringDisplay from 'src/pages/preview/StringDisplay'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/addresses'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { AddressType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWEAddress, formatTimestampMemo } from 'src/configs/functions'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'

import Pagination from '@mui/material/Pagination'

import addressName from 'src/configs/addressname'

const addressMap: any = addressName


interface AddressCellType {
  row: AddressType
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



const AddressesList = () => {
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
  const store = useSelector((state: RootState) => state.addresses)

  useEffect(() => {
    console.log("paginationModel", paginationModel)
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

  
  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'Address',
      headerName: `${t(`Address`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: AddressCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/addresses/all/${row.id}`}>{addressMap[row.id] ? addressMap[row.id] : formatHash(row.id, 10)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'Balance',
      headerName: `${t(`Balance`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: AddressCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatXWEAddress(row.balance, 4)}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'Txs',
      headerName: `${t(`Txs`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: AddressCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.txs}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'Discovery',
      headerName: `${t(`Discovery`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: AddressCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/blocks/view/${row.lastblock}`}>{row.lastblock}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.28,
      field: 'Update',
      minWidth: 220,
      headerName: `${t(`Update`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: AddressCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatTimestampMemo(row.timestamp)}
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
              <CardHeader title={`${t('Addresses')}`} sx={{ px: 5, py: 3 }}/>          
            </Card>
          </Grid>
          {store.data.map((item: any, index: number) => {
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
                              {`${t(`Address`)}`}：<StringDisplay InputString={`${item.id}`} StringSize={7} href={`/addresses/all/${item.id}`}/>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Balance`)}`}：{formatXWEAddress(item.balance, 4)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Discovery`)}`}：{item.lastblock}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Update`)}`}：{formatTimestampMemo(item.timestamp)}
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
                <Pagination count={Math.ceil(store.total/paginationModel.pageSize)} variant='outlined' color='primary' page={paginationModel.page+1} onChange={handlePageChange} siblingCount={2} boundaryCount={3} />
              </Grid>
            </Box>
          </Box>
        </Grid>
        :
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t('Addresses')}`} />
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


export default AddressesList
