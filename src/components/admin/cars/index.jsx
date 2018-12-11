import React, { Component } from "react";
import AdminLayout from "../../hoc/adminLayout";
import { Link } from "react-router-dom";
import "./cars.css";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getToken} from '../../UI/misc';

class Cars extends Component {
  state = {
    isLoading: true,
    cars: []
  };

  componentDidMount() {
    axios.get(`https://api.rent-auto.biz.tm/info_models`, getToken()).then(res => {
    console.log(res.data)
    const list = res.data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
      this.setState({ cars: list, isLoading: false });
    });
  }
  render() {
    console.log(this.state.cars);
    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>full brand</TableCell>
                  <TableCell>note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.cars.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Link to={`/dashboard/cars/${item.id}`}>{item.full_name}</Link>
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <div className="progress_cars">
            {this.state.isLoading ? (
              <CircularProgress thikness={5} style={{ color: "lightblue" }} />
            ) : (
              ""
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default Cars;
