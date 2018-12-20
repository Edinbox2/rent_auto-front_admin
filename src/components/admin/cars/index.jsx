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
import { getHeaders } from "../../UI/misc";

class Cars extends Component {
  state = {
    isLoading: true,
    cars: []
  };

  componentDidMount() {
    axios
      .get(`https://api.rent-auto.biz.tm/info_models`, getHeaders())
      .then(res => {
        const list = res.data.sort((a, b) =>
          a.id > b.id ? 1 : b.id > a.id ? -1 : 0
        ).reverse();
        this.setState({ cars: list, isLoading: false });
      });
  }

  deleteHandler = id => {

    const array = this.state.cars;
    if (window.confirm("удалить?")) {
    const filterArray = array.filter(item => {
      return item.id !== id;
    });

    this.setState({ cars: filterArray });
    
      axios
        .delete(`https://api.rent-auto.biz.tm/models/${id}`, getHeaders())
        .then(res => {
          console.log("item has been removed");
        });
    }
  };

  render() {
    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>Наименование</TableCell>
                  <TableCell>удалить</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.cars.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Link to={`/dashboard/cars/${item.id}`}>
                        {item.full_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={ () => this.deleteHandler(item.id)}
                      >
                        <i className="large material-icons">delete</i>
                      </button>
                    </TableCell>
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
