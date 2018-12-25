import React, { Component } from "react";
import axios from "axios";
import { getHeaders } from "../../../UI/misc";

class Uploader extends Component {
  state = {
    selectedFile: "",
    uploadedFile: null,
    isLoading: false,
    name: ""
  };

  componentDidMount() {
    if (this.props.img) {
      this.setState({ selectedFile: this.props.img });
    }
  }

  upLoadFileHanlder = event => {
    this.setState({ uploadedFile: event.target.files[0] });
    if(!this.props.id){
      this.props.uploadedFile(event.target.files[0])
    }
  };

  submitUploadHandler = e => {
    e.preventDefault();
    if (this.props.id) {
      const fd = new FormData();
      const name = this.state.uploadedFile.name;
      const data = this.state.uploadedFile;
     
      fd.append("file", data, name);
      console.log(fd)
      axios
        .post(
          `https://srv.rent-auto.biz.tm/images/models/${this.props.id}`,
          fd,
          getHeaders()
        )
        .then(res => {
          const newName = name.slice(0, -3);
          const selectedFile = res.config.url + "/" + newName + "jpeg";
          this.setState({ selectedFile });
          this.props.selectedFile(selectedFile);
        });
    }
  };

  selectHandler = event => {
    const selectedFile = `https://srv.rent-auto.biz.tm/images/models/${
      event.target.value
    }`;
    this.setState({ selectedFile, name: event.target.value });
    console.log(selectedFile);
    this.props.selectedFile(selectedFile);
  };

  render() {
    console.log(this.state.selectedFile);
    return (
      <div>
{/* image */}
        {this.props.img ? (
          <img
            style={{ width: "50%", height: "50%" }}
            src={this.state.selectedFile}
            alt="file name"
          />
        ) : (
          <h4>выберите файл из списка</h4>
        )}

        {/* form with input and button */}
        <form onSubmit={e => this.submitUploadHandler(e)}>
          <input type="file" onChange={this.upLoadFileHanlder} />
          
          {this.props.id && this.state.uploadedFile ? (
            <button  onClick={e => this.submitUploadHandler(e)}>
              Загрузить
            </button>
          ) : null}

        </form>

{/* select with the list of images */}
        {this.props.id ? (
          <select
            value={this.state.name}
            onChange={event => this.selectHandler(event)}
          >
            {this.props.listOfImages.map((item, index) => (
              <option key={index} value={item.id + "/" + item.name}>
                {item.name}
              </option>
            ))}
          </select>
        ) : null}

      </div>
    );
  }
}

export default Uploader;
