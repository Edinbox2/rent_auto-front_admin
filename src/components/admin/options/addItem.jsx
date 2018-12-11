import React, { Component } from "react";
import "./index.css";
import { data } from "./data";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { getToken } from "../../UI/misc";
import axios from "axios";

class ListItem extends Component {
  state = {
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
    validId: true, 
    message: ''
  };

  changeHandler = (event, name) => {
    const newData = { ...this.state.data };
    newData[name] = event.target.value;
    newData.id = this.props.lastId
    this.setState({ data: newData });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState({ submit: true });
    let valid = true;
    const data = {...this.state.data}
    for (let key in data) {
      valid = data[key] !== "" && valid;
    } 
    if (valid) {
      axios
        .post(`https://api.rent-auto.biz.tm/additions`, data, getToken())
        .then(res => {
          const response = res.data;
          this.props.onAddHandler(response, null)
          const newData = {...this.state.data}
          
          newData.note = "";
          newData.price = "";
          newData.code = "";
          newData.name = "";

          this.setState({
            data: newData,
            submit: false,
            valid: true,
            validId: true, 
            message: ''
          });
        })
        .catch(error => {
        });
     
    }else {
      //заполните все поля
    }
  };

  render() {
    console.log(this.state.data.id)
    return (
      <TableRow>
        <TableCell>id</TableCell>
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
