import React, { Component } from 'react';
import AdminLayout from "../../hoc/adminLayout";
import List from './List'

class Options extends Component {
    render() {
        return (
            <AdminLayout>
                <List />
            </AdminLayout>
        );
    }
}

export default Options;