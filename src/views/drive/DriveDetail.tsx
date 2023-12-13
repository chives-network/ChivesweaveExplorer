// ** React Imports
import { Fragment, useState, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Custom Components Imports
import Sidebar from 'src/@core/components/sidebar'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Types
import { OptionType } from 'src/@core/components/option-menu/types'
import {
  LabelType,
  FileDetailType
} from 'src/types/apps/emailTypes'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import authConfig from 'src/configs/auth'

import ImagesPreview from 'src/pages/preview'

import { TxRecordType } from 'src/types/apps/Chivesweave'

import { getContentTypeAbbreviation, formatTimestampMemo } from 'src/configs/functions';

import { GetFileCacheStatus } from 'src/functions/ChivesweaveWallets'


const toggleImagesPreviewDrawer = () => {
  console.log("toggleImagesPreviewDrawer")
}

const ImgPreview = styled('img')(({  }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'cover',
  style: { zIndex: 1 }
}))

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
      return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['pdf']} />;
    case 'JSON':
      return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['json']} />;
    case 'XLS':
    case 'XLSX':
      return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['Excel']} />;
    case 'MP4':
      return <ImagesPreview key={TxRecord.id} open={true} toggleImagesPreviewDrawer={toggleImagesPreviewDrawer} imagesList={[`${authConfig.backEndApi}/${TxRecord.id}`]} imagesType={['Mp4']} />;
    default:
      return <Fragment></Fragment>
  }
}

const DriveDetail = (props: FileDetailType) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    currentFile,
    hidden,
    direction,
    labelColors,
    routeParams,
    handleStarDrive,
    driveFileOpen,
    handleLabelUpdate,
    setFileDetailOpen,
    handleMoveToTrash,
    handleMoveToSpam
  } = props

  const FullStatusRS: any = GetFileCacheStatus(currentFile)
  const FileFullStatus: any = FullStatusRS['FullStatus']

  const [tags, setTags] = useState<any>({})
  useEffect(() => {
    const tagsMap: any = {}
    currentFile && currentFile.tags && currentFile.tags.length > 0 && currentFile.tags.map( (Tag: any) => {
      tagsMap[Tag.name] = Tag.value;
    })
    setTags(tagsMap);
  }, [currentFile])

  // ** Hook
  const { settings } = useSettings()

  const handleMoveToTrashCurrentFile = () => {
    handleMoveToTrash(currentFile.id)
    setFileDetailOpen(false)
  }

  const handleMoveToSpamCurrentFile = () => {
    handleMoveToSpam(currentFile.id)
    setFileDetailOpen(false)
  }

  const handleLabelsMenu = () => {
    const array: OptionType[] = []
    Object.entries(labelColors).map(([key, value]: any) => {
      array.push({
        text: <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>,
        icon: (
          <Box component='span' sx={{ mr: 2, color: `${value}.main` }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleLabelUpdate(currentFile.id, key as LabelType)
          }
        }
      })
    })

    return array
  }
  
  /*
  const handleFoldersMenu = () => {
    const array: OptionType[] = []
    Object.entries(folderColors).map(([key, value]: any) => {
      array.push({
        text: <Typography sx={{ textTransform: 'capitalize' }}>{key}</Typography>,
        icon: (
          <Box component='span' sx={{ mr: 2, color: `${value}.main` }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleFolderUpdate([currentFile.id], key as FolderType)
          }
        }
      })
    })

    return array
  }
  */

  const prevMailIcon = direction === 'rtl' ? 'mdi:chevron-right' : 'mdi:chevron-left'
  const goBackIcon = prevMailIcon
  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  //console.log("currentFile", currentFile)

  return (
    <Sidebar
      hideBackdrop
      direction='right'
      show={driveFileOpen}
      sx={{ zIndex: 3, width: '100%', overflow: 'hidden' }}
      onClose={() => {
        setFileDetailOpen(false)        
      }}
    >
      {currentFile && currentFile.owner ? (
        <Fragment>
          <Box
            sx={{
              px: 2,
              py: 2,
              backgroundColor: 'background.paper',
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: ['flex-start', 'center'], justifyContent: 'space-between' }}>
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
              >
                <IconButton
                  size='small'
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setFileDetailOpen(false)                    
                  }}
                >
                  <Icon icon={goBackIcon} fontSize='2rem' />
                </IconButton>
                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexDirection: ['column', 'row']
                  }}
                >
                  <Typography noWrap sx={{ mr: 2, fontWeight: 500 }}>
                    {tags['File-Name']}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {routeParams && routeParams.initFolder !== 'trash' ? (
                    <IconButton size='small' onClick={handleMoveToTrashCurrentFile}>
                      <Icon icon='mdi:delete-outline' fontSize='1.375rem' />
                    </IconButton>
                  ) : null}
                  <IconButton size='small' onClick={handleMoveToSpamCurrentFile}>
                    <Icon icon='mdi:alert-circle-outline' fontSize='1.375rem' />
                  </IconButton>
                  <OptionsMenu
                    leftAlignMenu
                    options={handleLabelsMenu()}
                    iconButtonProps={{ size: 'small' }}
                    icon={<Icon icon='mdi:label-outline' fontSize='1.375rem' />}
                  />
                </Box>
              <div>
                <IconButton
                  size='small'
                  onClick={e => handleStarDrive(e, currentFile.id, !FileFullStatus['Star'])}
                  sx={{ ...(true ? { color: FileFullStatus['Star'] ? 'warning.main' : 'text.secondary' } : {}) }}
                >
                  <Icon icon={FileFullStatus['Star'] ? 'mdi:star' : 'mdi:star-outline'} fontSize='1.375rem'/>
                </IconButton>
              </div>
              </Box>
            </Box>
          </Box>
          <Box sx={{ height: 'calc(100% - 3rem)', backgroundColor: 'action.hover' }}>
            <ScrollWrapper>
              <Box
                sx={{
                  py: 4,
                  px: 4,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    width: '100%',
                    borderRadius: 1,
                    overflow: 'visible',
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    boxShadow: settings.skin === 'bordered' ? 0 : 6,
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box sx={{ p: 4 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          alt={tags['File-Name']}
                          src={`${authConfig.backEndApi}/${currentFile.id}/thumbnail`}
                          sx={{ width: '2.375rem', height: '2.375rem', mr: 3 }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant='body2'>{t('Owner') as string}: {currentFile.owner.address}</Typography>
                          <Typography variant='caption' sx={{ mr: 3 }}>
                            {t('Time') as string}: {formatTimestampMemo(currentFile.block.timestamp)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ m: '0 !important' }} />
                  <Box sx={{ p: 4, pt: 4 }}>
                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                      { parseTxAndGetMemoFileInfoInTags(currentFile) }                                  
                    </Typography>
                  </Box>
                </Box>

              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default DriveDetail
