import React, { Component } from 'react';
import axios from 'axios';
import {FormField} from '../../../UI/formField';


class Rentals extends Component {
    state={
        range_rates: [
            {name: 'от 1 до 6 дней (седан-основной)', rate: 0.93}
        ], 
        slice_rates: [
            {name: 'выходные дни (седан-основной)', rate: 0.92}
        ]
    }

    submitForm = (e)=>{
        e.preventDefaut()
        axios.patch(`https://api.rent-auto.biz.tm/info_models/id `)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submitForm}>
                
                </form>
            </div>
        );
    }
}

export default Rentals;