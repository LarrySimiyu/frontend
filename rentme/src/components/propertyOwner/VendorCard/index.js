import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";

export default class VendorCard extends Component {
  state = {
    vendors: [],
    activeVendor: {},
    vendor: {}
  };

  componentDidMount() {
    const endpoint = "https://rent-me-app.herokuapp.com/api/vendor";
    axios
      .get(endpoint)
      .then(res => {
        this.setState({
          vendors: res.data,
          vendor: res.data.find(
            vendor => `${vendor.id}` === this.props.match.params.id
          )
        });
      })
      .catch(error => {
        console.error("USERS ERROR", error);
      });
  }

  deleteVendors = id => {
    return axios
      .delete(`https://rent-me-app.herokuapp.com/api/vendor/${id}`)
      .then(res => {
        const vendors = res.data;
        this.setState({ vendors });

        this.props.history.push("/vendor-addbook");
        // console.log(res);
        // redirect
      })
      .catch(err => {
        console.log(err);
      });
  };

  setActiveVendor = vendor => {
    this.setState({ activeVendor: vendor });
  };

  updateVendor = e => {
    e.preventDefault();
    this.setActiveVendor(this.state.vendor);
    this.props.history.push(`/edit-vendor/${this.state.vendor.id}`);
  };

  deleteVendor = e => {
    e.preventDefault();
    this.deleteVendors(this.state.vendor.id);
  };

  render() {
    return (
      <div>
        <Container>
          <h1>{this.state.vendor.company_name}'s Profile</h1>
          <div>
            <h2>Details & Contact Information</h2>
            <Grid container>
              <Grid item md={6}>
                <p>
                  Contractor Name: {this.state.vendor.first_name}{" "}
                  {this.state.vendor.last_name}
                </p>
                <p>Email: {this.state.vendor.email}</p>
                <p>Phone Number: {this.state.vendor.phone}</p>
                <p>Address: {this.state.vendor.address}</p>
              </Grid>
            </Grid>
          </div>
          <Button onClick={this.updateVendor}>Edit Vendor</Button>
          <Button onClick={this.deleteVendor}>Delete Vendor</Button>
        </Container>
        <hr />
      </div>
    );
  }
}