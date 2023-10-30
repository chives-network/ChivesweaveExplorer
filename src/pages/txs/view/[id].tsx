// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router';

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Next Import
import Link from 'next/link'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'

import { formatHash, formatXWE, formatTimestamp, formatStorageSize, getContentTypeAbbreviation, parseTxAndGetMemoInfo } from 'src/configs/functions';

import ImagesPreview from 'src/pages/preview'

import { ThemeColor } from 'src/@core/layouts/types'

interface FileTypeObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { TxRecordType } from 'src/types/apps/Chivesweave'

interface txViewInfoType {
  tx: any
  txs: any
}

const ImgOriginal = styled('img')(({  }) => ({
  maxWidth: '100%',
  objectFit: 'cover',
  borderRadius: '5px',
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

const toggleImagesPreviewDrawer = () => {
  console.log("toggleImagesPreviewDrawer")
}

function parseTxAndGetMemoFileInfo(TxRecord: TxRecordType) {
  const FileMap: { [key: string]: string } = {}
  TxRecord.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileType = getContentTypeAbbreviation(FileMap['Content-Type']);
  console.log("FileType", `${authConfig.backEndApi}/${TxRecord.id}`)
  switch(FileType) {
    case 'PNG':
    case 'GIF':
    case 'JPEG':
    case 'JPG':
    case 'WEBM':
      return <ImgOriginal src={`${authConfig.backEndApi}/${TxRecord.id}`}/>
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

const BlockView = () => {
  
  const router = useRouter();
  const { id } = router.query;

  const [txViewInfo, settxViewInfo] = useState<txViewInfoType>()
  const [fileName, setFileName] = useState("Data")

  useEffect(() => {
    if(id != undefined) {
      axios
        .get(authConfig.backEndApi + '/tx/' + id + '/unbundle', { headers: { }, params: { } })
        .then(res => {
          settxViewInfo(res.data);
          let TempFileName = '';
          res.data && res.data.tx && res.data.tx.tags && res.data.tx.tags.map((Item: { [key: string]: string }) => {
            if(Item.name=="File-Name") {
              console.log("Item.value", Item.value)
              TempFileName = Item.value;
              setFileName(Item.value)
            }
          });
          if(TempFileName == '') {
            setFileName("Data")
          }
        })
        .catch(() => {
          console.log("axios.get editUrl return")
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
                            <TableCell>{id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Value:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(txViewInfo.tx.quantity.winston, 6)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              From:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/addresses/view/${txViewInfo.tx.owner.address}`}>{formatHash(txViewInfo.tx.owner.address, 7)}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              To:
                              </Typography>
                            </TableCell>
                            <TableCell><LinkStyled href={`/addresses/view/${txViewInfo.tx.recipient}`}>{formatHash(txViewInfo.tx.recipient, 7)}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Fee:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(txViewInfo.tx.fee.winston, 7)}</TableCell>
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
                            <TableCell><LinkStyled href={`/blocks/view/${txViewInfo.tx.block.height}`}>{txViewInfo.tx.block.height}</LinkStyled></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Block Hash:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatHash(txViewInfo.tx.block.indep_hash, 7)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Block Time:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatTimestamp(txViewInfo.tx.block.timestamp)}</TableCell>
                          </TableRow>

                          {txViewInfo.tx && txViewInfo.tx.bundleid ? 
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                Bundled In:
                                </Typography>
                              </TableCell>
                              <TableCell>{formatHash(txViewInfo.tx.bundleid, 7)}</TableCell>
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
                            <TableCell>{formatStorageSize(txViewInfo.tx.data.size)}</TableCell>
                          </TableRow>
                          

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                </Grid>
              </CardContent>

            </Card>
          </Grid>

          {txViewInfo.tx && txViewInfo.tx.tags && txViewInfo.tx.tags.length > 0 ?
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
                            {txViewInfo.tx.tags.map((Item: {[key: string]: string}, Index: number)=>{
                              return (
                                    <TableRow key={Index}>
                                      <TableCell>
                                        <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                          {Item.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>{Item.value}</TableCell>
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

          {txViewInfo.tx && txViewInfo.tx.tags && txViewInfo.tx.tags.length > 0 && (txViewInfo.txs && txViewInfo.txs.length == 0) ?
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
                                  { parseTxAndGetMemoFileInfo(txViewInfo.tx) }                                  
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
          
          {txViewInfo.txs && txViewInfo.txs.length > 0 ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Bundle' />

                <Divider sx={{ m: '0 !important' }} />

                <TableContainer>
                  <Table sx={{ minWidth: 500 }}>
                    <TableHead >
                      <TableRow>
                        <TableCell>Hash</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Fee</TableCell>
                        <TableCell>Info</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {txViewInfo.txs.map((item: TxRecordType, index: number) => (
                        <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                          <TableCell><LinkStyled href={`/txs/view/${item.id}`}>{formatHash(item.id, 7)}</LinkStyled></TableCell>
                          <TableCell><LinkStyled href={`/addresses/view/${item.owner.address}`}>{formatHash(item.owner.address, 7)}</LinkStyled></TableCell>
                          <TableCell>{formatStorageSize(item.data.size)}</TableCell>
                          <TableCell>
                            {getContentTypeAbbreviation(item.data.type)}
                            <CustomAvatar skin='light' color={(FileTypeObj[getContentTypeAbbreviation(item.data.type)]?.color as ThemeColor) || ('primary' as ThemeColor)} sx={{ width: '1.875rem', height: '1.875rem' }}>
                              <Icon icon={FileTypeObj[getContentTypeAbbreviation(item.data.type)]?.icon} fontSize='1rem' />
                            </CustomAvatar>
                          </TableCell>
                          <TableCell>{formatXWE(item.fee.winston, 6)}</TableCell>
                          <TableCell>{parseTxAndGetMemoInfo(item)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

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





export default BlockView
