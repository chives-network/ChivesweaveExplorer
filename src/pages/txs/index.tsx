// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import authConfig from 'src/configs/auth'

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
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize, getContentTypeAbbreviation } from 'src/configs/functions';

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

const ImgOriginal = styled('img')(({  }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  style: { zIndex: 1 }
}))

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

function ImagePreview(ImageSource: string) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const img = new Image();
    img.src = ImageSource;

    img.onload = () => {
      setImageError(false);
    };

    img.onerror = () => {
      setImageError(true);
    };
  }, [ImageSource]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!imageError && !isHovered && (
        <Img src={ImageSource} />
      )}
      {!imageError && isHovered && (
        <div className="preview">
          <ImgOriginal src={ImageSource} 
          />
        </div>
      )}
    </div>
  );
}

function parseTxFeeAndBundleId(TxRecord: TxRecordType) {
  if(TxRecord.bundleid && TxRecord.bundleid!="") {
  
    return <LinkStyledNormal href={`/txs/view/${TxRecord.bundleid}`}>{formatHash(TxRecord.bundleid, 5)}</LinkStyledNormal>
  }

  return formatXWE(TxRecord.fee.winston, 6);
}

function parseTxAndGetMemoFileInfo(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  
  //console.log("FileType", FileType)
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return ImagePreview(`${authConfig.backEndApi}/${TxRecord.id}/thumbnail`)
    case 'PDF':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'XLS':
    case 'XLSX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'DOC':
    case 'DOCX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'PPT':
    case 'PPTX':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'MP4':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'MP3':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'WAV':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']}</LinkStyled>
    case 'JSON':
      return <LinkStyled href={`/txs/view/${TxRecord.id}`}>{FileMap['File-Name']?FileMap['File-Name']:FileType}</LinkStyled>
  }

  //Bundle Support
  const BundleFormat = getContentTypeAbbreviation(FileMap['Bundle-Format']);
  const BundleVersion = getContentTypeAbbreviation(FileMap['Bundle-Version']);
  if(BundleFormat == "binary") {
    return "Bundle " + BundleVersion;
  }

  //Video Format

  if(TxRecord.recipient != "") {
        
    return (
        <Typography noWrap variant='body2'>
          {formatXWE(TxRecord.quantity.winston, 4) + " -> "}
          <LinkStyled href={`/addresses/view/${TxRecord.id}`}>{formatHash(TxRecord.recipient, 5)}</LinkStyled>
        </Typography>

    )
  }

  return "Unknown";

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
    flex: 0.15,
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
          {parseTxFeeAndBundleId(row)}
        </Typography>
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 200,
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

const TransactionList = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  
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
