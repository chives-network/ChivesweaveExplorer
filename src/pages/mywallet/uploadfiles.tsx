// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/file-uploader/FileUploaderMultiple'

const FileUploader = () => {
  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={
            <Typography variant='h5'>
              Upload files to Blockchain
            </Typography>
          }
          subtitle={<Typography variant='body2'>You can choose multiple files for simultaneous uploading. Uploading files to blockchain may take 3-10 minutes.</Typography>}
        />
        <Grid item xs={12}>
            <FileUploaderMultiple />
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default FileUploader
