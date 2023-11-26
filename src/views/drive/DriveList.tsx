// ** React Imports
import { Fragment, useState, SyntheticEvent, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import ListItem, { ListItemProps } from '@mui/material/ListItem'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Email App Component Imports
import { setTimeout } from 'timers'
import DriveDetail from './DriveDetail'

import Pagination from '@mui/material/Pagination'

import toast from 'react-hot-toast'

// ** Types
import {
  DriveListType,
  LabelType,
  FolderType,
  MailFoldersArrType,
  MailFoldersObjType
} from 'src/types/apps/emailTypes'
import { OptionType } from 'src/@core/components/option-menu/types'

import authConfig from 'src/configs/auth'

import { formatTimestamp} from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { TrashMultiFiles, SpamMultiFiles, StarMultiFiles, UnStarMultiFiles, ChangeMultiFilesLabel, ChangeMultiFilesFolder, GetFileCacheStatus, GetHaveToDoTask,ResetToDoTask, FolderMultiFiles, ActionsSubmitToBlockchain } from 'src/functions/ChivesweaveWallets'
import { TxRecordType } from 'src/types/apps/Chivesweave'

const FileItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-of-type)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
    '& .mail-actions': { display: 'flex' },
    '& .mail-info-right': { display: 'none' },
    '& + .MuiListItem-root': { borderColor: 'transparent' }
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const DriveList = (props: DriveListType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const {
    store,
    query,
    hidden,
    lgAbove,
    dispatch,
    setQuery,
    direction,
    routeParams,
    labelColors,
    folderColors,
    setCurrentFile,
    driveFileOpen,
    handleSelectFile,
    setFileDetailOpen,
    handleSelectAllFile,
    handleLeftSidebarToggle,
    paginationModel,
    handlePageChange
  } = props

  useEffect(()=>{
    dispatch(handleSelectAllFile(false))
  },[paginationModel])
  
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [isProgress, setIsProgress] = useState<boolean>(false)
  const [haveSubmitTextTip, setHaveSubmitTextTip] = useState<string>("")
  const [isHaveTaskToDo, setIsHaveTaskToDo] = useState<number>(0)
  const [haveTaskToDoNumber, setHaveTaskToDoNumber] = useState<number>(0)
  const [isHaveTaskToDoText, setIsHaveTaskToDoText] = useState<string>("")
  useEffect(()=>{
    const GetHaveToDoTaskData: number = GetHaveToDoTask()
    setHaveTaskToDoNumber(GetHaveToDoTaskData)
    setIsHaveTaskToDoText("Submit to blockchain")
  },[isHaveTaskToDo])

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false)

  // ** Vars
  const folders: MailFoldersArrType[] = [
    {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    {
      name: 'myfiles',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  ]

  const foldersConfig = {
    draft: {
      name: 'draft',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
        </Box>
      )
    },
    spam: {
      name: 'spam',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:alert-octagon-outline' fontSize={20} />
        </Box>
      )
    },
    trash: {
      name: 'trash',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
        </Box>
      )
    },
    myfiles: {
      name: 'myfiles',
      icon: (
        <Box component='span' sx={{ mr: 2, display: 'flex' }}>
          <Icon icon='mdi:email-outline' fontSize={20} />
        </Box>
      )
    }
  }

  const foldersObj: MailFoldersObjType = {
    myfiles: [foldersConfig.spam, foldersConfig.trash],
    sent: [foldersConfig.trash],
    draft: [foldersConfig.trash],
    spam: [foldersConfig.myfiles, foldersConfig.trash],
    trash: [foldersConfig.myfiles, foldersConfig.spam]
  }

  const handleMoveToTrash = () => {
    console.log("store.selectedFiles", store)
    if( store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      TrashMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleMoveToSpam = () => {
    console.log("store.selectedFiles", store)
    if( store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      SpamMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleStarDrive = (e: SyntheticEvent, id: string, value: boolean) => {
    e.stopPropagation()
    if(value) {
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => Item.id == id );
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      StarMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
    else {
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => Item.id == id );
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      UnStarMultiFiles(TargetFiles);
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleLabelUpdate = (id: string | string[], label: LabelType) => {
    const selectedFiles = Array.isArray(id) ? [...id] : [id]
    console.log("store.selectedFiles", store)
    if( store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      ChangeMultiFilesLabel(TargetFiles, label);
      //FolderMultiFiles(TargetFiles, "Myfiles");
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleFolderUpdate = (id: string | string[], folder: FolderType) => {
    const selectedFiles = Array.isArray(id) ? [...id] : [id]
    console.log("store.selectedFiles", store)
    if( store.selectedFiles && store.selectedFiles.length > 0 && store.data && store.data.length > 0) {
      setIsHaveTaskToDo(isHaveTaskToDo + 1);
      const TargetFiles: TxRecordType[] = store.data.filter((Item: TxRecordType)  => store.selectedFiles.includes(Item.id));
      ChangeMultiFilesFolder(TargetFiles, folder);
      //FolderMultiFiles(TargetFiles, "Myfiles");
      dispatch(handleSelectAllFile(false))
    }
  }

  const handleActionsSubmitToBlockchain = () => {
    setIsDialog(true);
    setOpen(true);
  }

  const handleActionsSubmitToBlockchainYes = async () => {
    setIsProgress(true)
    const ActionsSubmitToBlockchainResult = await ActionsSubmitToBlockchain(setUploadProgress);
    console.log("ActionsSubmitToBlockchainResult", ActionsSubmitToBlockchainResult)
    if(ActionsSubmitToBlockchainResult && ActionsSubmitToBlockchainResult.id) {
      setHaveSubmitTextTip(`${t(`Submitted successfully`)}`)
      //setOpen(false)
      //setIsDialog(false)
      //setIsProgress(false)

      const delayExecution = setTimeout(() => {
        setOpen(false);
        setIsDialog(false);
        setIsProgress(false);
        ResetToDoTask();
        setIsHaveTaskToDo(isHaveTaskToDo + 1);
        toast.success(t(`Submitted successfully`), {
          duration: 2000
        })
      }, 2000);

      return () => clearTimeout(delayExecution);
    }
  }

  const handleNoClose = () => {
    setOpen(false)
    setIsDialog(false)
  }

  const handleCancelOperation = () => {
    ResetToDoTask();
    setIsHaveTaskToDo(isHaveTaskToDo + 1);
  }

  const handleRefreshDriveClick = () => {
    setIsHaveTaskToDo(isHaveTaskToDo + 1);
    setRefresh(true)
    setTimeout(() => setRefresh(false), 1000)
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
            handleLabelUpdate(store.selectedFiles, key as LabelType)
            dispatch(handleSelectAllFile(false))
          }
        }
      })
    })

    return array
  }

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
            handleFolderUpdate(store.selectedFiles, key as FolderType)
            dispatch(handleSelectAllFile(false))
          }
        }
      })
    })

    return array
  }

  const driveDetailsProps = {
    hidden,
    folders,
    dispatch,
    direction,
    foldersObj,
    routeParams,
    labelColors,
    handleStarDrive,
    driveFileOpen,
    handleLabelUpdate,
    handleFolderUpdate,
    setFileDetailOpen,
    currentFile: store && store.currentFile ? store.currentFile : null
  }

  console.log("labelColors", labelColors)

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', '& .ps__rail-y': { zIndex: 5 } }}>
      {isDialog == true ? 
        <Fragment>
          <Dialog
              open={open}
              disableEscapeKeyDown
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              >
              <DialogTitle id='alert-dialog-title'>{`${t(`Submit to Blockchain`)}`}</DialogTitle>
              <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    {`${t(`Would you like to submit your operations to the blockchain? This process may take 3-5 minutes.`)}`}
                  </DialogContentText>
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                  {isProgress == true && haveSubmitTextTip == "" ? 
                    <Fragment>
                      <CircularProgress disableShrink sx={{ m: 6 }} />
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == true && haveSubmitTextTip != "" ? 
                    <Fragment>
                      <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {haveSubmitTextTip}
                            </Typography>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  {isProgress == false ? 
                    <Fragment>
                      <Button onClick={handleActionsSubmitToBlockchainYes} color="error" size='large' variant='contained' >{`${t(`Yes`)}`}</Button>
                      <Button onClick={handleNoClose} color="primary">{`${t(`No`)}`}</Button>
                    </Fragment>
                  :
                  <Fragment></Fragment>
                  }
                  
              </DialogActions>
          </Dialog>
        </Fragment>
      :
      <Fragment></Fragment>
      }
      <Box sx={{ height: '100%', backgroundColor: 'background.paper' }}>
        <Box sx={{ px: 5, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {lgAbove ? null : (
              <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 1, ml: -2 }}>
                <Icon icon='mdi:menu' fontSize={20} />
              </IconButton>
            )}
            <Input
              value={query}
              placeholder={`${t(`Search File Name`)}`}
              onChange={e => setQuery(e.target.value)}
              sx={{ width: '100%', '&:before, &:after': { display: 'none' } }}
              startAdornment={
                <InputAdornment position='start' sx={{ color: 'text.disabled' }}>
                  <Icon icon='mdi:magnify' fontSize='1.375rem' />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ py: 2, px: { xs: 2.5, sm: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {store && store.data && store.selectedFiles ? (
                <Checkbox
                  onChange={e => dispatch(handleSelectAllFile(e.target.checked))}
                  checked={(store.data.length && store.data.length === store.selectedFiles.length) || false}
                  indeterminate={
                    !!(
                      store.data.length &&
                      store.selectedFiles.length &&
                      store.data.length !== store.selectedFiles.length
                    )
                  }
                />
              ) : null}

              {store && store.selectedFiles.length && store.data && store.data.length ? (
                <Fragment>
                  <OptionsMenu leftAlignMenu options={handleFoldersMenu()} icon={<Icon icon='mdi:folder-outline' />} />
                  <OptionsMenu leftAlignMenu options={handleLabelsMenu()} icon={<Icon icon='mdi:label-outline' />} />
                  {routeParams && routeParams.folder !== 'Trash' && routeParams.folder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Trash`)}`} arrow>
                      <IconButton onClick={handleMoveToTrash}>
                        <Icon icon='mdi:delete-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {routeParams && routeParams.folder !== 'Trash' && routeParams.folder !== 'Spam' ? (
                    <Tooltip title={`${t(`Move to Spam`)}`} arrow>
                      <IconButton onClick={handleMoveToSpam}>
                        <Icon icon='mdi:alert-octagon-outline' />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Fragment>
              ) : null}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {haveTaskToDoNumber && haveTaskToDoNumber>0 ?
                <Fragment>
                  <Tooltip title={isHaveTaskToDoText} arrow>
                    <Button fullWidth color={'primary'} variant={'contained'} onClick={handleActionsSubmitToBlockchain}> {isHaveTaskToDoText} ({haveTaskToDoNumber}) </Button>
                  </Tooltip>
                  <Tooltip title={`${t(`Cancel Operation`)}`} arrow>
                    <IconButton size='small' onClick={handleCancelOperation}>
                      <Icon icon='mdi-redo-variant' fontSize='1.375rem' />
                    </IconButton>
                  </Tooltip>
                </Fragment>
                :
                <Fragment></Fragment>
              }
              <Tooltip title={`${t(`Refresh`)}`} arrow>
                <IconButton size='small' onClick={handleRefreshDriveClick}>
                  <Icon icon='mdi:reload' fontSize='1.375rem' />
                </IconButton>
              </Tooltip>
              <IconButton size='small'>
                <Icon icon='mdi:dots-vertical' fontSize='1.375rem' />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 12rem)' }}>
          <ScrollWrapper hidden={hidden}>
            {store && store.data && store.data.length ? (
              <List sx={{ p: 0 }}>
                {store.data.map((drive: TxRecordType) => {
                  const TagsMap: any = {}
                  drive && drive.tags && drive.tags.length > 0 && drive.tags.map( (Tag: any) => {
                    TagsMap[Tag.name] = Tag.value;
                  })

                  const FileCacheStatus = GetFileCacheStatus(drive.id)
                  
                  return (
                    <FileItem
                      key={drive.id}
                      sx={{ backgroundColor: true ? 'action.hover' : 'background.paper' }}
                      onClick={() => {
                        if(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam") {
                        }
                        else {
                          setFileDetailOpen(true)
                          dispatch(setCurrentFile(drive))
                          setTimeout(() => {
                            dispatch(handleSelectAllFile(false))
                          }, 600)
                        }
                      }}
                    >
                      <Tooltip title={(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam") ? `${t(`You cannot perform operations on files in the Trash or Spam`)}` :''} arrow>
                        <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                          
                          <Checkbox
                            onClick={e => e.stopPropagation()}
                            onChange={() => dispatch(handleSelectFile(drive.id))}
                            checked={store.selectedFiles.includes(drive.id) || false}
                            disabled={(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam")}
                          />
                          <IconButton
                            size='small'
                            onClick={e => handleStarDrive(e, drive.id, !FileCacheStatus['Star'])}
                            disabled={(FileCacheStatus.Folder == "Trash" || FileCacheStatus.Folder == "Spam")}
                            sx={{
                              mr: { xs: 0, sm: 3 },
                              color: FileCacheStatus['Star'] ? 'warning.main' : 'text.secondary',
                              '& svg': {
                                display: { xs: 'none', sm: 'block' }
                              }
                            }}
                          >
                            <Icon icon={FileCacheStatus['Star'] ? 'mdi:star' : 'mdi:star-outline'} />
                          </IconButton>
                          {store.table[drive.id] && store.table[drive.id]['item_label'] && labelColors[store.table[drive.id]['item_label']] ?
                            <Tooltip title={store.table[drive.id]['item_label']} arrow>
                              <Box component='span' sx={{ mr: 2, ml: -2, color: `${labelColors[store.table[drive.id]['item_label']]}.main` }}>
                                <Icon icon='mdi:circle' fontSize='0.75rem' />
                              </Box>
                            </Tooltip>
                          :
                            <Tooltip title={'No label'} arrow>
                              <Box component='span' sx={{ mr: 2, ml: -2, color: `text.secondary` }}>
                                <Icon icon='mdi:circle' fontSize='0.75rem' />
                              </Box>
                            </Tooltip>
                          }
                          
                          <Avatar
                            alt={TagsMap['File-Name']}
                            src={`${authConfig.backEndApi}/${drive.id}/thumbnail`}
                            sx={{ mr: 3, width: '2rem', height: '2rem' }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              overflow: 'hidden',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'flex-start', sm: 'center' }
                            }}
                          >
                            <Typography
                              sx={{
                                mr: 4,
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                width: ['100%', 'auto'],
                                overflow: ['hidden', 'unset'],
                                textOverflow: ['ellipsis', 'unset']
                              }}
                            >
                              {TagsMap['File-Name']}
                            </Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                      <Box
                        className='mail-info-right'
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        <Typography
                          variant='caption'
                          sx={{ minWidth: '50px', textAlign: 'right', whiteSpace: 'nowrap', color: 'text.disabled' }}
                        >
                          {formatTimestamp(drive.block.timestamp)}
                        </Typography>
                      </Box>
                    </FileItem>
                  )
                })}

              </List>
            ) : (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
                <Icon icon='mdi:alert-circle-outline' fontSize={20} />
                <Typography>{`${t(`No Files Found`)}`}</Typography>
              </Box>
            )}
          </ScrollWrapper>
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: 'absolute',
              color: 'common.white',
              backgroundColor: 'action.disabledBackground'
            }}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </Box>
        
        <Divider sx={{ m: '0 !important' }} />
        <Box sx={{ px: 5, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
              <Pagination  count={Number(store.allPages)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} siblingCount={2} boundaryCount={3} />
            </Grid>
          </Box>
        </Box>

      </Box>

      {/* @ts-ignore */}
      <DriveDetail {...driveDetailsProps} />
    </Box>
  )
}

export default DriveList
