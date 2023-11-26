// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import { DriveLayoutType } from 'src/types/apps/emailTypes'

// ** Email App Component Imports
import DriveList from 'src/views/drive/DriveList'
import SidebarLeft from 'src/views/drive/SidebarLeft'
import UploadFiles from 'src/views/form/uploadfiles';

import CardContent from '@mui/material/CardContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Actions
import {
  fetchData,
  setCurrentFile,
  handleSelectFile,
  handleSelectAllFile,
  fetchTotalNumber
} from 'src/store/apps/drive'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Variables
const labelColors: any = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

// ** Variables
const folderColors: any = {
  Root: 'error',
  Work: 'success',
  Home: 'primary',
  Blockchain: 'warning'
}

const DriveAppLayout = ({ folder, label, type }: DriveLayoutType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** States
  const [query, setQuery] = useState<string>('')
  const [uploadFilesOpen, setUploadFilesOpen] = useState<boolean>(false)
  const [uploadFilesTitle, setUploadFilesTitle] = useState<string>(`${t(`Upload Files`)}`)
  const [driveFileOpen, setFileDetailOpen] = useState<boolean>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector((state: RootState) => state.drive)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const routeParams = {
    label: label || 'Personal',
    type: type || 'image',
    folder: folder || 'Root'
  }

  const auth = useAuth()

  const id = auth.currentAddress

  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 9 })
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    if(true && id && id.length == 43) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: type,
          folder: folder,
          label: label
        })
      )
      dispatch(
        fetchTotalNumber({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: type,
          folder: folder,
          label: label
        })
      )
      setUploadFilesOpen(false)
      setUploadFilesTitle(`${t(`Upload Files`)}`)
    }
  }, [dispatch, paginationModel, type, folder, label, id])

  const toggleUploadFilesOpen = () => {
    setUploadFilesOpen(!uploadFilesOpen)
    if(uploadFilesOpen) {
      setUploadFilesTitle(`${t(`Upload Files`)}`)
    }
    else {
      setUploadFilesTitle(`${t(`Back To List`)}`)
    }
  }
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  console.log("store", store);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        routeParams={routeParams}
        driveFileOpen={driveFileOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        uploadFilesTitle={uploadFilesTitle}
        toggleUploadFilesOpen={toggleUploadFilesOpen}
        setFileDetailOpen={setFileDetailOpen}
        handleSelectAllFile={handleSelectAllFile}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
      />
      { !uploadFilesOpen ?
        <DriveList
          query={query}
          store={store}
          hidden={hidden}
          lgAbove={lgAbove}
          dispatch={dispatch}
          setQuery={setQuery}
          direction={direction}
          routeParams={routeParams}
          labelColors={labelColors}
          folderColors={folderColors}
          setCurrentFile={setCurrentFile}
          driveFileOpen={driveFileOpen}
          handleSelectFile={handleSelectFile}
          setFileDetailOpen={setFileDetailOpen}
          handleSelectAllFile={handleSelectAllFile}
          handleLeftSidebarToggle={handleLeftSidebarToggle}        
          paginationModel={paginationModel}
          handlePageChange={handlePageChange}
        />
        :
        <CardContent>
          <UploadFiles />
        </CardContent>
      }
    </Box>
  )
}

export default DriveAppLayout
