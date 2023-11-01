// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/addresses'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { AddressType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWEAddress, formatTimestampMemo } from 'src/configs/functions';

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


const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'Address',
    headerName: 'Address',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: AddressCellType) => {
      
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/addresses/view/${row.id}`}>{formatHash(row.id, 10)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 110,
    field: 'Balance',
    headerName: 'Balance',
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
    headerName: 'Txs',
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
    headerName: 'Discovery',
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
    headerName: 'Update',
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

const AddressesList = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  console.log("paginationModel", paginationModel)
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.addresses)

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Addresses' />
          <Divider />
          <DataGrid
            autoHeight
            rows={store.data}
            rowCount={store.total}
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
  )
}

AddressesList.guestGuard = true

export default AddressesList
