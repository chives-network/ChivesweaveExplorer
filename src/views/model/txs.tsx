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
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

import ImagesPreview from 'src/pages/preview'

import { formatHash, formatXWE, formatTimestamp, formatStorageSize, getContentTypeAbbreviation, formatTimestampAge } from 'src/configs/functions';
import { downloadUrlFile } from 'src/functions/ChivesweaveWallets';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/transactionbundles'

import { RootState, AppDispatch } from 'src/store'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { ThemeColor } from 'src/@core/layouts/types'

import StringDisplay from 'src/pages/preview/StringDisplay'
import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';


// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile } from 'src/configs/functions'
import Pagination from '@mui/material/Pagination'

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

const LinkStyledNormal = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

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


function ImagePreview(ImageSource: string, EntityType: string, EntityAction: string, EntityTarget: string) {
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

  console.log("EntityType", EntityType)

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      {!imageError && !isHovered && (
        <Fragment>
          <Img src={ImageSource} />
          {EntityAction} -{'>'} {EntityTarget}
        </Fragment>
      )}
      {!imageError && isHovered && (
        <div className="preview">
          <ImgOriginal src={ImageSource} />
        </div>
      )}
    </div>
  );
}

function parseTxAndGetMemoFileInfoInDataGrid(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  const FileTxId = FileMap['File-TxId'];
  const EntityType = FileMap['Entity-Type'];
  const EntityAction = FileMap['Entity-Action'];
  const EntityTarget = FileMap['Entity-Target-Text'] ? FileMap['Entity-Target-Text'] : FileMap['Entity-Target'];
  let ImageUrl = ""
  if(FileTxId && FileTxId.length == 43) {
    ImageUrl = FileTxId
  }
  else {
    ImageUrl = TxRecord.id
  }
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return ImagePreview(`${authConfig.backEndApi}/${ImageUrl}/thumbnail`, EntityType, EntityAction, EntityTarget)
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
          <LinkStyled href={`/addresses/all/${TxRecord.recipient}`}>{formatHash(TxRecord.recipient, 5)}</LinkStyled>
        </Typography>

    )
  }

  return "Unknown";

}

const TxView = () => {
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

  const [txViewInfo, setTxViewInfo] = useState<TxRecordType>()
  const [fileName, setFileName] = useState("Data")
  const [isLoading, setIsLoading] = useState(false)
  const [isBundleTx, setIsBundleTx] = useState(false)
  const [tags, setTags] = useState<any>({})
  const [fileUrl, setFileUrl] = useState<string>("")
  const [fileContenType, setFileContenType] = useState<string>("")

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
          
          const tagsMap: any = {}
          res.data && res.data.tags && res.data.tags.length > 0 && res.data.tags.map( (Tag: any) => {
            tagsMap[Tag.name] = Tag.value;
          })
          setTags(tagsMap);
          console.log("tagsMap", tagsMap)

          const TempFileName = '';
          const FileMap: { [key: string]: string } = {}
          res.data && res.data.tags && res.data && res.data.tags.map((Item: { [key: string]: string }) => {
            FileMap[Item.name] = Item.value;
          });
          const FileName = FileMap['File-Name']; 
          if(FileName) {
            setFileName(FileMap[FileName]);
          }
          else {
            setFileName("Data");
          }
          const BundleFormat = FileMap['Bundle-Format']; 
          if(BundleFormat) {
            setIsBundleTx(true);
          }
          else {
            setIsBundleTx(false);
          }
          const ContentType = FileMap['Content-Type']; 
          if(ContentType) {
            setFileContenType(FileMap[ContentType]);
          }
          else {
            setFileContenType("");
          }
          const FileTxId = FileMap['File-TxId'];          
          let ImageUrl = ""
          if(FileTxId && FileTxId.length == 43) {
            ImageUrl = FileTxId
          }
          else {
            ImageUrl = res.data.id
          }
          setFileUrl(`${authConfig.backEndApi}/${ImageUrl}`);
          if(TempFileName == '') {
          }
          setIsLoading(false);
        })
        .catch(() => {
          console.log("axios.get editUrl return");
        })
    }
  }, [id])

  function parseTxAndGetMemoFileInfoInTags(TxRecord: TxRecordType) {
    const FileMap: { [key: string]: string } = {}
    TxRecord.tags.map((Item: { [key: string]: string }) => {
      FileMap[Item.name] = Item.value;
    });
    const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
    const FileTxId = FileMap['File-TxId'];
    let ImageUrl = ""
    if(FileTxId && FileTxId.length == 43) {
      ImageUrl = FileTxId
    }
    else {
      ImageUrl = TxRecord.id
    }
    
    console.log("FileType", FileType)
    switch(FileType) {
      case 'PNG':
      case 'GIF':
      case 'JPEG':
      case 'JPG':
      case 'WEBM':
        return <ImgPreview src={`${authConfig.backEndApi}/${ImageUrl}`}/>
      case 'PDF':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['pdf']} />;
      case 'JSON':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['json']} />;
      case 'DOCX':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['Word']} />;
      case 'XLSX':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['Excel']} />;
      case 'Video':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['Video']} />;
      case 'Audio':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}`]} imagesType={['Audio']} />;
      case 'DOC':
      case 'XLS':
      case 'PPT':
      case 'PPTX':
        return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${ImageUrl}/pdf`]} imagesType={['pdf']} />;
      default:
        return <Fragment></Fragment>;
    }
  }

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
            {parseTxAndGetMemoFileInfoInDataGrid(row)}
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
      {txViewInfo && txViewInfo.block ? 
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Transactions`)}`} />
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
                                {`${t(`ID`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {id && id.length == 43 ?
                                <Fragment>                              
                                  {isMobileData == true ?
                                    <StringDisplay InputString={String(id)} StringSize={10} href={null}/>
                                    :
                                    <StringDisplay InputString={String(id)} StringSize={25} href={null}/>
                                  }
                                </Fragment>
                                :
                                <Fragment></Fragment>
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`Value`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(txViewInfo.quantity.winston, 6)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`From`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell>
                                <StringDisplay InputString={`${txViewInfo.owner.address}`} StringSize={7} href={`/addresses/all/${txViewInfo.owner.address}`}/>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`To`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <StringDisplay InputString={`${txViewInfo.recipient}`} StringSize={7} href={`/addresses/all/${txViewInfo.recipient}`}/>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`Fee`)}`}:
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
                                {`${t(`Block Height`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/blocks/view/${txViewInfo.block.height}`}>{txViewInfo.block.height}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`Block Hash`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell><StringDisplay InputString={txViewInfo.block.indep_hash} StringSize={7} href={null}/></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`Block Time`)}`}:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatTimestamp(txViewInfo.block.timestamp)}</TableCell>
                          </TableRow>

                          {txViewInfo && txViewInfo.bundleid ? 
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                {`${t(`Bundled In`)}`}:
                                </Typography>
                              </TableCell>
                              <TableCell><StringDisplay InputString={txViewInfo.bundleid} StringSize={7} href={null}/></TableCell>
                            </TableRow>
                          :
                            <Fragment></Fragment>
                          }
                          
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              {`${t(`Data Size`)}`}:
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
                <CardHeader title={`${t(`Tags`)}`} />
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
                                      <TableCell><StringDisplay InputString={Item.value} StringSize={25} href={null}/></TableCell>
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

          {txViewInfo.tags && txViewInfo.tags.length > 0 && isBundleTx == false && tags["Cipher-ALG"] == undefined  ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title={`${t(fileName)}`} />
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
                                <Button color={'primary'} variant={'outlined'} onClick={() => downloadUrlFile(fileUrl, fileName, fileContenType)}>
                                  {t(`Download`)}
                                </Button>
                              </TableCell>
                            </TableRow>
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
          
          {isBundleTx && store.data && store.data.length > 0 ?
          <Fragment>
            {isMobileData ? 
            <Fragment>
              <Grid item xs={12} sx={{pl: 5}}>
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
            </Fragment>
            :
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
            }
          </Fragment>
          :
          null
          }
        </Grid>
      :
      <Fragment></Fragment>
    }
    </Fragment>
  )
}

export default TxView
