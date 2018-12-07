import React, { Component } from "react";
import "./index.css";
import { data } from "./data";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

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
    message: ""
  };

  changeHandler = (event, name) => {
    const newData = { ...this.state.data };
    newData[name] = event.target.value;
    this.setState({ data: newData, message: "" });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    const data = this.state.data;
    for (let key in data) {
      if ((!data[key.active] || !data[key.service]) && data[key] === "") {
        this.setState({ message: "заполните все поля" });
        return;
      } else {
        this.props.onSubmitHandler(this.state.data);
        this.setState({ message: "элемент добвлен" });
        setTimeout(() => {
          this.setState({ message: "" });
        }, 1000);
      }
    }

    const newData = { ...this.state.data };
    newData.id = "";
    newData.note = "";
    newData.price = "";
    newData.code = "";
    newData.name = "";
    this.setState({ data: newData });
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
              onChange={event => this.changeHandler(event, item.name)}
            />
          </TableCell>
        ))}
        <TableCell>
          <button className="add_button" onClick={this.onSubmitHandler}>
            <i className="large material-icons">add_circle_outline</i>
          </button>
        </TableCell>
      </TableRow>
    );
  }
}

export default ListItem;
