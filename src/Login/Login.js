import React, { Component } from 'react';

import Flexbox from 'flexbox-react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { SERVER_BASE_URL } from '../configuration/Config'

import axios from 'axios'
class Login extends Component {

    
    constructor() {
        super()
        this.state = {
            username: ''
        }

        this.handleClick = this.handleClick.bind(this)
  
    }
    //add form validation method that allow us to send http request only when input text is not empty 
    validateForm() {
        return this.state.username !== '';
    }

    handleClick = () => {
        // sending post request to the server endpoint using axios 
        axios.post(
            `${SERVER_BASE_URL}/user`,
            { username: this.state.username })
            .then(response => {
                //set new state to username property 
                this.setState({ username: response.data.username })
                //storing connected user into localstorage
                localStorage.setItem('user', JSON.stringify(response.data))


            })


    }
    handleChange = (event) => {
        this.setState({
            username: event.target.value,
        });
    };
    render() {
        return (
            <Flexbox flexDirection="column" minHeight="100vh" maxWidth="60vh" >
                <TextField
                    id="standard-with-placeholder"
                    label="Enter you username"
                    placeholder="Enter you username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    margin="normal"
                />
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={!this.validateForm()}
                    onClick={this.handleClick}
                >
                    Login
          </Button>
            </Flexbox>
        )

    }


}

export default Login