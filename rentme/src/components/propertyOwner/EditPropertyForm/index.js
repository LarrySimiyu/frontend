import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import OwnerUserMenu from "../../SideMenu/OwnerUserMenu";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withAuthorization } from "../../Session";
import { compose } from "recompose";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import "typeface-roboto";
import placeholer from "../../../placeholderImages/modernHouse.png";
import "../../imageMediaQueries.css";

import * as ROLES from "../../../constants/roles";

const drawerWidth = 240;

const styles = theme => ({
  mainContainer: {
    display: "block"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: drawerWidth
    }
  },

  dashboard: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: "1.5rem"
    }
  },

  formCard: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    width: "70%",
    marginTop: "2rem",
    padding: "1.5rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  uploadField: {
    marginTop: "2rem",
    marginBottom: "2rem"
  },

  pageContainer: {
    textAlign: "center",
    margin: "0 auto",
    width: "60%",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "column"
    }
  },

  buttons: {
    display: "flex",
    margin: "0rem auto",
    justifyContent: "space-between",
    marginTop: "1rem",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  button: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "1rem",
      marginTop: "1rem"
    }
  },
  backButton: {
    "&:hover": {
      color: "#008c3a",
      backgroundColor: "transparent"
    }
  },
  h1: {
    fontSize: "2.4rem",
    marginBottom: "2rem"
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 500
  },
  field: {
    marginTop: "1rem"
  },
  propertyImage: {
    width: "250px",
  },
  editTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      cursor: "pointer",
      color: "#303F9F"
    }
  },
  editText: {
    "&:hover": {
      fontWeight: 500
    }
  },
  editImageSection: {
    marginBottom: "1rem",
    marginTop: "1rem",
    "&:hover": {
      cursor: "pointer",
      color: "#303F9F"
    }
  },
  
});

class EditPropertyForm extends Component {
  constructor() {
    super();
    this.state = {
      properties: [],
      activeProperty: {},
      propertyImageChanging: false
    };
  }

  componentDidMount() {
    const endpoint = "https://rent-me-app.herokuapp.com/api/property";
    axios
      .get(endpoint)
      .then(res => {
        const properties = res.data;
        this.setState({
          properties,
          activeProperty: properties.find(
            p => `${p.id}` === this.props.match.params.id
          )
        });
      })
      .catch(error => {
        console.error("USERS ERROR", error);
      });
  }

  updateProperty = updatedProperty => {
    console.log(updatedProperty);
    axios
      .put(
        `https://rent-me-app.herokuapp.com/api/property/${updatedProperty.id}`,
        updatedProperty
      )
      .then(res => {
        const properties = res.data;
        this.setState({
          properties
        });
        console.log("success!");

        // redirect
        this.props.history.push(`/property-card/${updatedProperty.id}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    e.persist();
    this.setState({
      activeProperty: {
        ...this.state.activeProperty,
        [e.target.name]: e.target.value
      }
    });
  };

  onSubmitEditedProperty = e => {
    e.preventDefault();
    this.updateProperty(this.state.activeProperty);
  };

  handleImageChange = e => {
    const image = e.target.files[0];

    // console.log("-------file name--------");
    // console.log(image.name);
    // console.log("-------file name--------");

    // console.log(this.state.property.id);

    const fd = new FormData();

    let fullFileName = this.state.activeProperty.id + " " + Date.now() + " " + image.name;

    // console.log(fullFileName);

    fd.append("image", image, fullFileName);

    this.handleUploadPicture(fd, fullFileName);
  };

  handleUploadPicture = (fd, fullFileName) => {
    
    this.setState({propertyImageChanging: true});
  
    axios.post(
      "https://us-central1-rentme-52af4.cloudfunctions.net/uploadFile",
      fd,
      {
        onUploadProgress: progressEvent => {
          console.log(
            "Upload Progress: " +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              "%"
          );
        }
      }
    ).then(() => { 
      // console.log(fullFileName);
      setTimeout(() => {
        axios.get(`https://us-central1-rentme-52af4.cloudfunctions.net/getfile/file/${fullFileName}`)
      .then(res => {

      // console.log(res.data);
      let newImageUrl = res.data;

      this.setState(prevState => ({
        activeProperty: {
          ...prevState.activeProperty,
          image_url: newImageUrl
        } 
      }));

      this.setState({propertyImageChanging: false});

      this.updatePropertyInfo();
      // this.componentDidMount();
    })}, (0 * 1000))})

}
  

  updatePropertyInfo = () => {

    let updatedProperty = this.state.activeProperty;
    // console.log(updatedProperty);
  
    axios
      .put(
        `https://rent-me-app.herokuapp.com/api/property/${updatedProperty.id}`,
        {"image_url": updatedProperty.image_url}
      )
      .then(res => {
        // console.log(res);
        console.log("success!");
      })
      .catch(err => {
        console.log(err);
      });
  };


  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  goBack = e => {
    this.props.history.goBack();
  };

  propstate = [
    { label: "AK" },
    { label: "AL" },
    { label: "AR" },
    { label: "AZ" },
    { label: "CA" },
    { label: "CO" },
    { label: "CT" },
    { label: "DE" },
    { label: "FL" },
    { label: "GA" },
    { label: "HI" },
    { label: "IA" },
    { label: "ID" },
    { label: "IL" },
    { label: "IN" },
    { label: "KS" },
    { label: "KY" },
    { label: "LA" },
    { label: "MA" },
    { label: "MD" },
    { label: "ME" },
    { label: "MI" },
    { label: "MN" },
    { label: "MO" },
    { label: "MS" },
    { label: "MT" },
    { label: "NC" },
    { label: "ND" },
    { label: "NE" },
    { label: "NH" },
    { label: "NJ" },
    { label: "NM" },
    { label: "NV" },
    { label: "NY" },
    { label: "OH" },
    { label: "OK" },
    { label: "OR" },
    { label: "PA" },
    { label: "RI" },
    { label: "SC" },
    { label: "SD" },
    { label: "TN" },
    { label: "TX" },
    { label: "UT" },
    { label: "VA" },
    { label: "VT" },
    { label: "WA" },
    { label: "WI" },
    { label: "WV" },
    { label: "WY" }
  ];

  render() {
    if (!this.state.activeProperty) return <h3>Loading data...</h3>;
    return (
      <div className={this.props.classes.mainContainer}>
        <OwnerUserMenu />
        <main className={this.props.classes.content}>
          <div className={this.props.classes.dashboard}>
            <Button
              onClick={this.goBack}
              className={this.props.classes.backButton}
            >
              <Icon fontSize="small">arrow_back_ios</Icon>
              PREVIOUS PAGE
            </Button>
            <Paper className={this.props.classes.formCard}>
              <div className={this.props.classes.pageContainer}>
                <Typography variant="h1" className={this.props.classes.h1}>
                  Edit Property
                </Typography>
                <div>
                  <form
                    onSubmit={this.onSubmitEditedProperty}
                    className={this.props.classes.form}
                  >
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="property_name"
                      label="Property Name"
                      name="property_name"
                      autoComplete="property_name"
                      margin="normal"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.activeProperty.property_name}
                    />
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="address"
                      margin="normal"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.activeProperty.address}
                    />
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="unit"
                      label="Unit/Apartment #"
                      name="unit"
                      autoComplete="unit"
                      margin="normal"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.activeProperty.unit}
                    />
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      margin="normal"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.activeProperty.city}
                    />
                    <TextField
                      id="state"
                      name="state"
                      select
                      label="State*"
                      value={this.state.activeProperty.state}
                      onChange={this.handleChange}
                      helperText="Select State"
                      margin="normal"
                      variant="outlined"
                      placeholder="Please select"
                    >
                      <MenuItem disabled="disabled" value>
                        Please select
                      </MenuItem>
                      {this.propstate.map(ps => (
                        <MenuItem key={ps.label} value={ps.label} required>
                          {ps.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="zip"
                      label="Zip Code"
                      name="zip"
                      autoComplete="zip"
                      margin="normal"
                      autoFocus
                      onChange={this.handleChange}
                      value={this.state.activeProperty.zip}
                    />
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Monthly Rent"
                      id="rent"
                      name="rent"
                      onChange={this.handleChange}
                      value={this.state.activeProperty.rent}
                      variant="outlined"
                      className={this.props.classes.field}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        )
                      }}
                    />
                    <div>
                      <input
                        style={{ display: "none" }}
                        id="imageInput"
                        type="file"
                        onChange={this.handleImageChange}
                      />

                      {this.state.propertyImageChanging === true ? (
                       <div className="loader" id="centerLoader"></div>
                      ) : (
                        <>

                          {this.state.activeProperty.image_url === null ? (
                            <div
                              onClick={this.handleEditPicture}
                              className={this.props.classes.editImageSection}
                            >
                              {" "}
                              <Tooltip title="Edit/Upload Photo" placement="left">
                                <img
                                  className={this.props.classes.propertyImage}
                                  id="propertyFormPropertyImage"
                                  src={placeholer}
                                  alt="house placeholder"
                                />
                              </Tooltip>
                              <div className={this.props.classes.editTitle}>
                                <Icon fontSize="medium">publish</Icon>
                                <Typography
                                  className={this.props.classes.editText}
                                  variant="body1"
                                >
                                  Edit Property Photo
                                </Typography>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={this.handleEditPicture}
                              className={this.props.classes.editImageSection}
                            >
                              <Tooltip title="Edit/Upload Photo" placement="left">
                                <img
                                  className={this.props.classes.propertyImage}
                                  id="propertyFormPropertyImage"
                                  src={this.state.activeProperty.image_url}
                                  alt="rental house photo"
                                />
                              </Tooltip>
                              <div className={this.props.classes.editTitle}>
                                <Icon fontSize="medium">publish</Icon>
                                <Typography
                                  className={this.props.classes.editText}
                                  variant="body1"
                                >
                                  Edit Property Photo
                                </Typography>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className={this.props.classes.buttons}>
                      <Grid item xs={12} md={5}>
                        <Button
                          className={this.props.classes.button}
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Link to="/owner-dash">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            fullWidth
                          >
                            Cancel
                          </Button>
                        </Link>
                      </Grid>
                    </div>
                  </form>
                </div>
              </div>
            </Paper>
          </div>
        </main>
      </div>
    );
  }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.OWNER];

export default compose(
  withStyles(styles),
  withAuthorization(condition)
)(EditPropertyForm);
