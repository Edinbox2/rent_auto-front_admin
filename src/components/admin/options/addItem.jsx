import React, { Component } from "react";
import "./index.css";
import { data } from "./data";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {idValidation} from '../../UI/misc'

class ListItem extends Component {
  state = {
    edit: false,
    data: {
      id: "",
      code: "",
      name: "",
      active: true,
      service: true,
      price: "",
      note: ""
    },
    submit: false, 
    valid: false,
    validId: true
  };

  changeHandler = (event, name) => {
    const newData = { ...this.state.data };
    newData[name] = event.target.value;
    this.setState({ data: newData});
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState({submit: true})
    let valid = true;
    let validId = idValidation(this.props.list, this.state.data)
    const data = this.state.data;
    for (let key in data) {
      valid = data[key] !== "" && valid;
    }
    if(valid){
    this.props.onSubmitHandler(this.state.data);
    if(validId){
       const newData = { ...this.state.data };
    newData.id = "";  
    newData.note = "";
    newData.price = "";
    newData.code = "";
    newData.name = "";
    this.setState({ data: newData, submit: false, valid: true, validId: true });
    }
    }else{
      this.setState({valid: false, validId: false})
    }
  };

  render() {
    return (
      <TableRow>
        {data.map(item => (
          <TableCell key={item.name}>
            <input
              style={item.style}
              type={item.type}
              value={this.state.data[item.name]}
              placeholder={item.name}
              name={item.name}
              className={
                this.state.submit
                  ? this.state.data[item.name] === ""
                    ? "Danger"
                    : "Valid" 
                  : "Default"
              }
              onChange={event => this.changeHandler(event, item.name)}
            />
          </TableCell>
        ))}
        <TableCell>
          <button className="button" onClick={this.onSubmitHandler}>
            <i className="large material-icons">add_circle_outline</i>
          </button>
        </TableCell>
      </TableRow>
    );
  }
}

export default ListItem;
