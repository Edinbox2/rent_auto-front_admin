import React, { Component } from "react";
import axios from "axios";
import { getHeaders } from "../../../UI/misc";

class imageUploader extends Component {
  state = {
    uploadedFile: null
  };

  updateFileInput = event => {
    this.setState({
      uploadedFile: event.target.files[0]
    });
    this.props.updateFile(event.target.files[0])
  };
  
  // сomponentWillRecieveProps(nextProps){
  //     if(this.props.id || nextProps.id){
  //       this.SubmitFileUpload  
  //       console.log('success')
  //     }else{
  //         console.log('failed')
  //     }      
  // }
  SubmitFileUpload = e => {
    e.preventDefault();
    if (this.props.id) {
        console.log(this.props.id)
      const fd = new FormData();
      const image = this.state.uploadedFile.name;
      const data = this.state.uploadedFile;
      fd.append("file", data, image);
      axios
        .post(
          `https://srv.rent-auto.biz.tm/images/models/${this.props.id}`,
          fd,
          getHeaders()
        )
        .then(res => {});
    }else{

    }
  };

  render() {
      console.log(this.props.id)
    return (
      <form onSubmit={this.SubmitFileUpload}>
        {this.props.img ? (
          <img
            src={this.props.img}
            alt="file name"
            style={{ height: "200px" }}
          />
        ) : (
          <h4>выберите изображение из списка</h4>
        )}
        <br />
        <input type="file" onChange={this.updateFileInput} />
        <button onClick={this.SubmitFileUpload}>загрузить</button>
      </form>
    );
  }
}

export default imageUploader;
