import React, { Component } from "react";
import "./index.css";
import { data } from "./data";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

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
    this.props.onSubmitForm(this.state.data, this.props.name);
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
            className="edit_button"
            onClick={this.state.edit ? this.onEditSubmit : this.editHander}
          > <i className="large material-icons">
              {this.state.edit ? "save" : "edit"}
            </i>
          </button>
        </TableCell>
      </TableRow>
    );
  }
}

export default ListItem;
