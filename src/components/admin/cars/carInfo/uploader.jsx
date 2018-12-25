import React, { Component } from "react";
import axios from "axios";
import { getHeaders } from "../../../UI/misc";

class Uploader extends Component {
  state = {
    selectedFile: "",
    UploadedFile: null,
    isLoading: false,
    name: ''
  };

  componentDidMount() {
    if (this.props.img) {
      this.setState({ selectedFile: this.props.img });
    }
  }

  upLoadFileHanlder = event => {
    this.setState({ UploadedFile: event.target.files[0] });
  };

  submitUploadHandler = e => {
    e.preventDefault();
    if (this.props.id) {
      const fd = new FormData();
      const name = this.state.UploadedFile.name;
      const data = this.state.UploadedFile.data;
      fd.append("file", data, name);
      axios
        .post(
          `https://srv.rent-auto.biz.tm/images/models/${this.props.id}`,
          fd,
          getHeaders()
        )
        .then(res => {});
    }
  };

  selectHandler = event => {
    const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${event.target.value}`;
    this.setState({ selectedFile, name: event.target.value });
    console.log(selectedFile)
    this.props.selectedFile(selectedFile);
  };

  render() {
    console.log(this.state.selectedFile);
    return (
      <div>
        {this.props.img ? (
          <img
            style={{ width: "50%", height: "50%" }}
            src={this.state.selectedFile}
            alt="file name"
          />
        ) : (
          <h4>выберите файл из списка</h4>
        )}
        <form onSubmit={e => this.submitUploadHandler(e)}>
          <input type="file" onChange={this.upLoadFileHanlder} />
          <button onClick={e => this.submitUploadHandler(e)}>Загрузить</button>
        </form>
        <select
        
          value={this.state.name}
          onChange={event => this.selectHandler(event)}
        >
          {this.props.images.map((item, index) => (
            <option key={index} value={item.id + "/" + item.name}>
              {item.name}
            </option>
          ))}
        </select>{" "}
      </div>
    );
  }
}

export default Uploader;
