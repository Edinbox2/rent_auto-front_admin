import React, { Component } from "react";
import "./index.css";
import { data } from "./data";

import {headers} from '../../UI/misc'
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import axios from 'axios';

class ListItem extends Component {
  state = {
    edit: false,
    data: {
      id: this.props.id,
      name: this.props.name,
      code: this.props.code,
      price: this.props.price,
      note: this.props.note
    }
  };

  onEditSubmit = e => {
    e.preventDefault();
    const data = {...this.state.data}
    axios.patch(`https://api.rent-auto.biz.tm/additions/${this.props.id}`,data, headers). then(res=>{
      const response = res.data
      this.props.onSubmitForm(response, this.props.name);
      })
    
    this.setState({ edit: false });
  };

  fieldsUpdate = (e, id) => {
    const newData = { ...this.state.data };
    newData[id] = e.target.value;
    this.setState({ data: newData });
  };

  editHander = e => {
    e.preventDefault();
    this.setState({ edit: true });
  };

  onDeleteHandler=()=>{
    if(window.confirm('удалить ?')){
      axios.delete(`https://api.rent-auto.biz.tm/additions/${this.props.id}`, headers). then(res=>{
      console.log('item removed from the list')
      })
      this.props.Delete(this.props.id)
    }
  }


  render() {
    return (
      <TableRow>
        {data.map(item => (
          <TableCell key={item.name}>
            {this.state.edit ? (
              <input
                style={item.style}
                type={item.type}
                value={this.state.data[item.name]}
                onChange={e => this.fieldsUpdate(e, item.name)}
              />
            ) : (
              <span>{this.state.data[item.name]}</span>
            )}
          </TableCell>
        ))}
        <TableCell>
          <button
            className="button"
            onClick={this.state.edit ? this.onEditSubmit : this.editHander}
          > <i className="large material-icons">
              {this.state.edit ? "save" : "edit"}
            </i>
          </button>
          {this.state.edit ? <button className="button" 
          onClick={this.onDeleteHandler}>
          <i className="large material-icons">
              delete
            </i></button> : null}
        </TableCell>
      </TableRow>
    );
  }
}

export default ListItem;
