import React, { Component } from 'react';
import axios from 'axios'; 
import {getHeaders} from '../../../UI/misc'

class imageUploader extends Component {

    state={
        uploadedFile: null, 
    }

    updateFileInput=(event)=>{
        this.setState({
            uploadedFile: event.target.files[0], 
        })
        
    }

    SubmitFileUpload=(e)=>{
        e.preventDefault()
        const fd = new FormData(); 
        const image = this.state.uploadedFile.name
        const data = this.state.uploadedFile
        fd.append('file', data, image)
        console.log(fd)
        axios.post(`https://srv.rent-auto.biz.tm/images/models/${this.props.id}/upload`, 
        fd, getHeaders()).then(res=>{
            console.log(res.data)

        })
    }

    render() {
        return (
            <form onSubmit={this.SubmitFileUpload}>
                <img src={this.props.img} alt="file name"
                style={{height: '200px'}}
                /><br/>
                <input type="file" onChange={this.updateFileInput}/>
                <button onClick={this.SubmitFileUpload}>загрузить</button>
            </form>
        );
    }
}

export default imageUploader;