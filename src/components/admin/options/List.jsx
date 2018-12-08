import React, { Component } from "react";
import axios from "axios";
import ListItem from "./ListItem";
import AddItem from "./addItem";
import { data } from "./data";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./index.css";
import { headers, idValidation } from "../../UI/misc";
import Error from "./error";

class List extends Component {
  state = {
    list: [],
    isLoading: true,
    error: ""
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    axios
      .get("https://api.rent-auto.biz.tm/additions", headers)
      .then(res => {
        const list = res.data;
        this.setState({ list, isLoading: false });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  getState = () => {
    return this.state.list
      .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
      .reverse();
  };

  onSubmitForm = (data, initName) => {
    let list = this.state.list;
    list.map(item => {
      if (item.name === initName) {
        item.id = data.id;
        item.name = data.name;
        item.price = data.price;
        item.note = data.note;
        item.code = data.code;
      }
      return item;
    });
    this.setState({ list });
  };

  addItem = data => {
    if (this.state.list) {
      const list = [...this.state.list];
      let valid = idValidation(list, data);
      console.log(valid);
      if (valid) {
        list.push(data);
        this.setState({ list, error: "" });
      } else {
        this.setState({ error: "такой id уже существует" });
      }
    }
  };

  deleteItem = id => {
    const array = this.getState();
    const filterArray = array.filter(item => {
      return item.id !== id;
    });
    this.setState({ list: filterArray });
  };

  saveChanges = e => {
    e.preventDefault();
    const data = this.state.list;
    axios
      .patch(`https://api.rent-auto.biz.tm/additions`, data, headers)
      .then(res => {
        this.setState({ list: res.data });
      })
      .catch(error => {
        this.setState({ isLoading: false, error });
      });
  };

  render() {
    const stateList = this.getState();
    const list = (
      <React.Fragment>
        {stateList.map(item => {
          return (
            <ListItem
              key={item.id}
              {...item}
              onSubmitForm={this.onSubmitForm}
              Delete={this.deleteItem}
            />
          );
        })}
      </React.Fragment>
    );

    return (
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {data.map(item => (
                  <TableCell key={item.name}>{item.name}</TableCell>
                ))}
                <TableCell>
                  <button onClick={this.saveChanges} className="save_form">
                    <i className="large material-icons">save</i>
                    <span>сохранить</span>
                  </button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AddItem onSubmitHandler={this.addItem} list={this.state.list} />
              <Error error={this.state.error} />
              {list}
            </TableBody>
          </Table>
        </Paper>
        <div className="progress">
          {this.state.isLoading ? (
            <CircularProgress thikness={5} style={{ color: "lightblue" }} />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default List;
