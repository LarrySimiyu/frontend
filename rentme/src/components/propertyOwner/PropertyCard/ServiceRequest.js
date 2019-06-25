import React, {useState } from "react"
import ServiceRequestModal from './ServiceRequestModal'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    minWidth: "48%",
    margin: "10px 5px",
    textAlign: "center",
  }
})

const ServiceRequest = () => {

  const classes = useStyles()

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <ServiceRequestModal />
        </CardContent>
      </Card>
    </>
  )
}

 export default ServiceRequest