// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/blocktransactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatStorageSize, formatTimestampAge } from 'src/configs/functions';

import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';

// ** Next Import
import { useRouter } from 'next/router'

import StringDisplay from 'src/pages/preview/StringDisplay';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface BlockViewInfoType {
  timestamp: number
  mining_time: number
  block_size: number
  reward_addr: string
  reward_pool: number
  txs_length: number
  currentheight: number
  height: number
  reward: number
  indep_hash: string
}

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


const BlockTransactionList = () => {
  // ** Hook
  const { t } = useTranslation()
  
  const router = useRouter();
  const { id } = router.query;
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.blocktransactions)

  const [blockViewInfo, setBlockViewInfo] = useState<BlockViewInfoType>()

  useEffect(() => {
    if(id != undefined) {
      axios
        .get(authConfig.backEndApi + '/block/txsrecord/' + id + "/0/2", { headers: { }, params: { } })
        .then(res => {
          setBlockViewInfo(res.data.block);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  useEffect(() => {
    setBlockViewInfo(store.params as BlockViewInfoType)
  }, [])

  useEffect(() => {
    if(id!=undefined) {
      dispatch(
        fetchData({
          height: Number(id),
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize
        })
      )
    }
  }, [dispatch, paginationModel, id])

  useEffect(() => {
    setIsLoading(false)
  }, [])

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
      field: 'Size',
      headerName: `${t(`Size`)}`,
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
    
    {blockViewInfo && blockViewInfo != undefined  && "timestamp" in blockViewInfo ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`Block`)} ${id}`} />
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
                            {`${t(`Block Hash`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell><StringDisplay InputString={`${blockViewInfo.indep_hash}`} StringSize={20} /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Grid container spacing={6}>

              <Grid item xs={12} lg={5}>
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
                            {`${t(`Timestamp`)}`}:
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Mined Time`)}`}:
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Size`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{formatStorageSize(blockViewInfo.block_size)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} lg={4}>
                <TableContainer>
                  <Table size='small'>
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
                            {`${t(`Age`)}`}:
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Miner`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <LinkStyled href={`/addresses/all/${blockViewInfo.reward_addr}`}>
                            <StringDisplay InputString={`${blockViewInfo.reward_addr}`} StringSize={7} />
                          </LinkStyled>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Tx Reward Pool`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{formatXWE(blockViewInfo.reward_pool, 2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} lg={3}>
                <TableContainer>
                  <Table size='small'>
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
                          {`${t(`Transactions`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{blockViewInfo.txs_length}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Confirmations`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{blockViewInfo.currentheight - blockViewInfo.height}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Miner Reward`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{formatXWE(blockViewInfo.reward, 2)}</TableCell>
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

    {store && store.data != undefined ?
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
      :
      <Fragment></Fragment>
    }
    </Grid>
  )
}

export default BlockTransactionList

