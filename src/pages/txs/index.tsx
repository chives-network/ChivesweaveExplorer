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
import { fetchData } from 'src/store/apps/transactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TransactionType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize } from 'src/configs/functions';

interface TransactionCellType {
  row: TransactionType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
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
    field: 'TxId',
    headerName: 'TxId',
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
    headerName: 'From',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/addresses/view/${row.from_address}`}>{formatHash(row.from_address, 7)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 60,
    headerName: 'Size',
    field: 'Size',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatStorageSize(row.data_size)}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 110,
    field: 'Fee',
    headerName: 'Fee',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatXWE(row.reward, 8)} XWE
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: 'Info',
    headerName: 'Info',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatHash(row.target, 7)}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'Height',
    headerName: 'Height',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/blocks/view/${row.block_height}`}>{row.block_height}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'Time',
    minWidth: 220,
    headerName: 'Time',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatTimestampAge(row.timestamp)}
        </Typography>
      )
    }
  }
]

const TransactionList = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  console.log("paginationModel", paginationModel)
  
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transactions' />
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


export default TransactionList
