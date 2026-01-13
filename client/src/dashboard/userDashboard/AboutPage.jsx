import { Avatar, Box, Button, Container, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import NotificationsNoneIcon  from '@mui/icons-material/NotificationsNone';

const AboutPage = () => {

  const sampleData = ["Adam","Adam@gmail.com"]



  return (
    <div>



      <Container  >
        <Box sx={{marginBottom:1}} >
          <Typography sx={{textAlign:"center"}} variant='h3'>About Us</Typography>
          <Typography sx={{textAlign:"center"}} variant='h6'>"Streamline your projects, enhance team collaboration, and stay ahead with TeamSync!"</Typography>
        </Box >

        <Box sx={{display:"flex", flexDirection:{lg:"row",xs:"column",sm:"column",md:"row"} ,p:4 , borderRadius:4 , backgroundColor:"#DDEAED"}}>

        

          <img src="/assets/images/About/aboutPic.png" alt="" />
          <Box sx={{display:"flex",flexDirection:"column",marginX:2}} >

              <Typography variant='h6' sx={{paddingY:"4rem"}}>
              TeamSync is a collaborative project management tool designed to help teams plan, track, and manage their work efficiently. Whether you are handling software development, marketing campaigns, or business operations, TeamSync provides the tools you need for seamless teamwork.</Typography>
            </Box>

        </Box>  




        {/* //why choose us section */}

        <Box sx={{display:"flex", flexDirection:"column"}} >

          <Typography sx={{textAlign:"center",marginBottom:4, marginTop:"5rem"}} variant='h3'>Why Choose us</Typography>

          <Grid container spacing={3} >

            <Grid item lg={6} md={6} sm={12} xs={12} >
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >Effortless Project & Task Management</Typography>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} >
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >Real-time Communication & File Sharing</Typography>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
             <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >Secure Role-Based Access for team members</Typography>
            </Grid>
            
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >Intuitive Dashboard & Progress Tracking</Typography>
            </Grid>

          </Grid>
          

        </Box>








        {/* How to Use TeamSync?  section*/}

        <Box sx={{display:"flex", flexDirection:"column", marginTop:"5rem" }} >
          <Typography sx={{textAlign:"center",marginBottom:4}} variant='h3'>How to Use TeamSync?</Typography>


          <Grid container spacing={3} sx={{marginBottom:6}}  >

            <Grid item lg={4} md={4} sm={6} xs={12} >
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >                              Sign Up & Log In –
              Create your account and access your dashboard.</Typography>
            </Grid>

            <Grid item lg={4} md={4} sm={6} xs={12} >
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >                                           Create a Project –
              Add a new project, set a description, and invite team members</Typography>
            </Grid>

            <Grid item lg={4} md={4} sm={6} xs={12}>
             <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >                                Assign Tasks – 
             Define tasks, set deadlines, and assign responsibilities</Typography>
            </Grid>
            
            <Grid item lg={4} md={4} sm={6} xs={12}>
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >                 Collaborate in Real-Time – 
              Share files, discuss updates, and track progress.</Typography>
            </Grid>

            <Grid item lg={4} md={4} sm={6} xs={12}>
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >                            Monitor & Manage – 
              Use analytics and reports to stay on top of deadlines.</Typography>
            </Grid>

            <Grid item lg={4} md={4} sm={6} xs={12}>
              <Typography sx={{backgroundColor:"#DDEAED",maxWidth:"30rem",textAlign:"center",paddingX:4,paddingY:2,borderRadius:2,alignContent:"center"}} >Ready to boost your team's productivity?
              Start using TeamSync today! </Typography>
            </Grid>

          </Grid>

        </Box>
      </Container>
    </div>
  )
}

export default AboutPage;