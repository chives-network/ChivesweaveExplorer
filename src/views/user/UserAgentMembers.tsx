// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import UserAgentMembersListTable from 'src/views/user/UserAgentMembersListTable'


const UserAgentMembers = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserAgentMembersListTable />
      </Grid>
    </Grid>
  )
}

export default UserAgentMembers
