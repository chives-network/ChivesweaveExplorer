// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router';

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Next Import
import Link from 'next/link'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'

import ImagesPreview from 'src/pages/preview'

import { formatHash, formatXWE, formatTimestamp, formatStorageSize, getContentTypeAbbreviation, formatTimestampAge } from 'src/configs/functions';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/transactionbundles'

import { RootState, AppDispatch } from 'src/store'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { ThemeColor } from 'src/@core/layouts/types'

import StringDisplay from 'src/pages/preview/StringDisplay';

interface TransactionCellType {
  row: TxRecordType
}

interface FileTypeObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

const toggleImagesPreviewDrawer = () => {
  console.log("toggleImagesPreviewDrawer")
}

const FileTypeObj: FileTypeObj = {
  TEXT: { color: 'primary', icon: 'mdi:receipt-text-edit' },
  HTML: { color: 'success', icon: 'vscode-icons:file-type-html' },
  JSON: { color: 'primary', icon: 'mdi:code-json' },
  XML: { color: 'warning', icon: 'vscode-icons:file-type-xml' },
  ZIP: { color: 'error', icon: 'vscode-icons:file-type-zip2' },
  JPEG: { color: 'info', icon: 'iconoir:jpeg-format' },
  PNG: { color: 'primary', icon: 'iwwa:file-png' },
  DOC: { color: 'success', icon: 'vscode-icons:file-type-word2' },
  XLS: { color: 'primary', icon: 'vscode-icons:file-type-excel2' },
  PPT: { color: 'warning', icon: 'vscode-icons:file-type-powerpoint2' },
  MP4: { color: 'error', icon: 'teenyicons:mp4-outline' },
  WEBM: { color: 'info', icon: 'teenyicons:webm-outline' },
  PDF: { color: 'primary', icon: 'vscode-icons:file-type-pdf2' },
  DOCX: { color: 'success', icon: 'vscode-icons:file-type-word2' },
  XLSX: { color: 'primary', icon: 'vscode-icons:file-type-excel2' },
  PPTX: { color: 'warning', icon: 'vscode-icons:file-type-powerpoint2' },
  GIF: { color: 'error', icon: 'teenyicons:gif-outline' },
  BMP: { color: 'primary', icon: 'teenyicons:bmp-outline' },
  MP3: { color: 'success', icon: 'teenyicons:mp3-outline' },
  WAV: { color: 'primary', icon: 'teenyicons:wav-outline' }
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

const ImgPreview = styled('img')(({  }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'cover',
  style: { zIndex: 1 }
}))

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
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      {!imageError && !isHovered && (
        <Img src={ImageSource} />
      )}
      {!imageError && isHovered && (
        <div className="preview">
          <ImgOriginal src={ImageSource} />
        </div>
      )}
    </div>
  );
}

function parseTxAndGetMemoFileInfoInTags(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  
  //console.log("FileType", `${authConfig.backEndApi}/${TxRecord.id}`)
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return <ImgPreview src={`${authConfig.backEndApi}/${TxRecord.id}`}/>
    case 'PDF':
      return <ImagesPreview open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['pdf']} />;
    case 'JSON':
      return <ImagesPreview open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['json']} />;
    case 'XLS':
    case 'XLSX':
      return <ImagesPreview open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['Excel']} />;
    case 'MP4':
      return <ImagesPreview open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['Mp4']} />;
    default:
      return <Fragment></Fragment>
  }
}

function parseTxAndGetMemoFileInfoInDataGrid(TxRecord: TxRecordType) {
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
          <LinkStyled href={`/addresses/all/${TxRecord.id}`}>{formatHash(TxRecord.recipient, 5)}</LinkStyled>
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
          <LinkStyled href={`/addresses/all/${row.owner.address}`}>{formatHash(row.owner.address, 7)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
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
    minWidth: 100,
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
    flex: 0.3,
    minWidth: 200,
    field: 'Info',
    headerName: 'Info',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {parseTxAndGetMemoFileInfoInDataGrid(row)}
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


const TxView = () => {
  
  const router = useRouter();
  const { id } = router.query;

  const [txViewInfo, setTxViewInfo] = useState<TxRecordType>()
  const [fileName, setFileName] = useState("Data")
  const [isLoading, setIsLoading] = useState(false)
  const [isBundleTx, setIsBundleTx] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transactionbundles)

  useEffect(() => {
    if(id!=undefined) {
      dispatch(
        fetchData({
          tx: String(id),
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize
        })
      )
    }
  }, [dispatch, paginationModel, id])

  useEffect(() => {
    if(id != undefined) {
      axios
        .get(authConfig.backEndApi + '/wallet/' + id + '/txrecord', { headers: { }, params: { } })
        .then(res => {
          setTxViewInfo(res.data);
          let TempFileName = '';
          setIsBundleTx(false);
          res.data && res.data.tags && res.data.tags.map((Item: { [key: string]: string }) => {
            if(Item.name=="File-Name")      {
              TempFileName = Item.value;
              setFileName(Item.value);
            }
            if(Item.name == "Bundle-Format")  {
              setIsBundleTx(true);
            }
          });
          if(TempFileName == '') {
            setFileName("Data");
          }
          setIsLoading(false);
        })
        .catch(() => {
          console.log("axios.get editUrl return");
        })
    }
  }, [id])

  return (
    <Fragment>
      {txViewInfo ? 
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`Transaction`} />
              <CardContent>
                <Grid container spacing={6}>

                  <Grid item xs={12} lg={7}>
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
                                ID:
                              </Typography>
                            </TableCell>
                            <TableCell><StringDisplay InputString={id} StringSize={20}/></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Value:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(txViewInfo.quantity.winston, 6)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              From:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/addresses/all/${txViewInfo.owner.address}`}>{formatHash(txViewInfo.owner.address, 7)}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              To:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/addresses/all/${txViewInfo.recipient}`}>{formatHash(txViewInfo.recipient, 7)}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Fee:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(txViewInfo.fee.winston, 7)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

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
                                Block Height:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/blocks/view/${txViewInfo.block.height}`}>{txViewInfo.block.height}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Block Hash:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatHash(txViewInfo.block.indep_hash, 7)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Block Time:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatTimestamp(txViewInfo.block.timestamp)}</TableCell>
                          </TableRow>

                          {txViewInfo && txViewInfo.bundleid ? 
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                Bundled In:
                                </Typography>
                              </TableCell>
                              <TableCell>{formatHash(txViewInfo.bundleid, 7)}</TableCell>
                            </TableRow>
                          :
                            <Fragment></Fragment>
                          }
                          
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Data Size:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatStorageSize(txViewInfo.data.size)}</TableCell>
                          </TableRow>
                          

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                </Grid>
              </CardContent>

            </Card>
          </Grid>

          {txViewInfo.tags && txViewInfo.tags.length > 0 ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title={`Tags`} />
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
                            {txViewInfo.tags.map((Item: {[key: string]: string}, Index: number)=>{
                              return (
                                    <TableRow key={Index}>
                                      <TableCell>
                                        <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                          {Item.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>{formatHash(Item.value, 20)}</TableCell>
                                    </TableRow>
                                    )
                            } )}
                            

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

          {txViewInfo.tags && txViewInfo.tags.length > 0 && isBundleTx == false ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title={fileName} />
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
                                  { parseTxAndGetMemoFileInfoInTags(txViewInfo) }                                  
                                </Typography>
                              </TableCell>
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
          
          {store && store.data != undefined && isBundleTx ?
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
      :
        <Fragment></Fragment>
    }
    </Fragment>
  )
}

export default TxView
