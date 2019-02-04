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
import { getHeaders, nextId } from "../../UI/misc";
import {FormattedMessage} from 'react-intl'; 

class List extends Component {
  state = {
    list: [],
    isLoading: true,
    message: '',
    lastId: ''
  };

  componentDidMount() {
    this.getList();
  }

  
  getList = () => {
    axios
      .get("https://api.rent-auto.biz.tm/additions", getHeaders())
      .then(res => {
        const list = res.data;
        const lastId = nextId(list)
        this.setState({ list, isLoading: false, lastId });
      })
      .catch(error => {
        this.setState({ message: error });
      });

  };

  getState = () => {
    return this.state.list
      .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
      .reverse();
  };

  addItem = (data, message) => {
    const list = [...this.state.list]
    let id = this.state.lastId + 1
    if(data !== null){
      list.push(data)
      
    }      
      this.setState({list, message, lastId: id })       
  };

  deleteItem = id => {
    const array = this.getState();
    const filterArray = array.filter(item => {
      return item.id !== id;
    });
    this.setState({ list: filterArray });
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
              list={this.state.list}
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
                <TableCell>id</TableCell>
                {data.map(item => (
                  <TableCell key={item.name}>
                  <FormattedMessage
                  id={item.name}
                  defaultMessage={item.name}
                  />
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AddItem onAddHandler={this.addItem}
              lastId={this.state.lastId}
              list={this.state.list} />
              
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
