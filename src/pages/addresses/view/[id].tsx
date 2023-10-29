// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

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
import { fetchData } from 'src/store/apps/addresstransactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize, getContentTypeAbbreviation } from 'src/configs/functions';

// ** Next Import
import { useRouter } from 'next/router'
import { string } from 'yup'


interface TransactionCellType {
  row: TxRecordType
}

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: theme.spacing(3)
}))

const ImgOriginal = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  style: { zIndex: 99999999999 }
}))

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

function ImagePreview(ImageSource: string) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isHovered && (
        <Img src={ImageSource} />
      )}
      {isHovered && (
        <div className="preview">
          <ImgOriginal src={ImageSource}/>
        </div>
      )}
    </div>
  );
}

function parseTxAndGetMemoFileInfo(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return ImagePreview(`${authConfig.backEndApi}/${TxRecord.id}/thumbnail`)
    case 'PNG':
      return <Img src={TxRecord.owner.address} />
    case 'PNG':
      return <Img src={TxRecord.owner.address} />
  }
}

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
          <LinkStyled href={`/addresses/view/${row.owner.address}`}>{formatHash(row.owner.address, 7)}</LinkStyled>
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
          {formatStorageSize(row.data.size)}
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
          {formatXWE(row.fee.winston, 6)}
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
          {parseTxAndGetMemoFileInfo(row)}
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
          <LinkStyled href={`/blocks/view/${row.block.height}`}>{row.block.height}</LinkStyled>
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
          {formatTimestampAge(row.block.timestamp)}
        </Typography>
      )
    }
  }
]

const AddressTransactionList = () => {

  const router = useRouter();
  const { id } = router.query;
  
  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.addresstransactions)

  useEffect(() => {
    if(id!=undefined) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize
        })
      )
    }
  }, [dispatch, paginationModel, id])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Address`} />
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
                            Address:
                          </Typography>
                        </TableCell>
                        <TableCell>{id}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Balance:
                          </Typography>
                        </TableCell>
                        <TableCell>Come Soon</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Total transactions:
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

    {store && store.data != undefined ?
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
      :
      <Fragment></Fragment>
    }
    </Grid>
  )
}


export default AddressTransactionList
