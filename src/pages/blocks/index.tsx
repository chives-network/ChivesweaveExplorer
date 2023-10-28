// ** React Imports
import { useState, useEffect } from 'react'

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
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/blocks'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { BlockType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatSecondToMinute, formatTimestampMemo, formatStorageSize } from 'src/configs/functions';

interface BlockCellType {
  row: BlockType
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
    flex: 0.15,
    minWidth: 80,
    field: 'Height',
    headerName: 'Height',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LinkStyled href={`/blocks/view/${row.height}`}>{row.height}</LinkStyled>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'Hash',
    headerName: 'Hash',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/blocks/view/${row.height}`}>{formatHash(row.indep_hash, 7)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.4,
    field: 'Time',
    minWidth: 260,
    headerName: 'Time',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatTimestampMemo(row.timestamp)}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 60,
    headerName: 'Txs',
    field: 'Txs',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.txs_length}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: 'Miner',
    headerName: 'Miner',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatHash(row.reward_addr, 7)}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'Reward',
    headerName: 'Reward',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatXWE(row.reward, 2)} XWE
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'Size',
    headerName: 'Size',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatStorageSize(row.block_size)}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 110,
    field: 'MinedTime',
    headerName: 'MinedTime',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: BlockCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatSecondToMinute(row.mining_time)}
        </Typography>
      )
    }
  }
]

const BlockList = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 })

  console.log("paginationModel", paginationModel)
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.blocks)

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
          <CardHeader title='Blocks' />
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
            pageSizeOptions={[10, 20, 30, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnMenu={true}
          />
        </Card>
      </Grid>
    </Grid>
  )
}


export default BlockList
