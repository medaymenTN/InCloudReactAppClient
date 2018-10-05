import React, { Component } from 'react';
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TimerMachine from 'react-timer-machine'

import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format"

import axios from 'axios'
import { SERVER_BASE_URL } from '../configuration/Config';
momentDurationFormatSetup(moment);
class TimeTracker extends Component {

    constructor() {
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            description: '',
            paused: false,
            started: false,
            stopped: false,
            resumed: false,
            open: false,
            date: moment().format('YYYY-MM-DD'),
            TimeRemaining: '',
            isStarted:false
        }

        this.StartTimer = this.StartTimer.bind(this);
        this.PauseTimer = this.PauseTimer.bind(this);
        this.ResumeTimer = this.ResumeTimer.bind(this);
        this.StopTimer = this.StopTimer.bind(this);
        this.handleChangeTimePopUp = this.handleChangeTimePopUp.bind(this)
        this.handleChangeDatePopUp = this.handleChangeDatePopUp.bind(this)
        this.handleChangeDescription = this.handleChangeDescription.bind(this)


    }

    StartTimer() {
      
        this.setState({
            started: true,
            isStarted:true
           
        });
    }

    PauseTimer() {
        this.setState({
            paused: true
        });
    }
    ResumeTimer() {
        this.setState({
            paused: false
        });
    }

    StopTimer() {
        this.setState({
            started: false
        });
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    BookTime = () => {
        if (!this.state.isStarted) {
            this.handleClickOpen()
          
        } else {

            this.PostTimeToServer()

        }
    }

    PostTimeToServer = () => {
        
        axios.post(
            `${SERVER_BASE_URL}/tracker`,
            {
                userId: this.state.user.id,
                time: this.state.date + ' ' + this.state.TimeRemaining,
                description: this.state.description
            })
            .then(response => {
                //set new state to username property 
                this.setState({ username: response.data.username })
                //storing connected user into localstorage
                localStorage.setItem('user', JSON.stringify(response.data))


            })

    }
    handleChangeDescription = (event) => {
        this.setState({
            description: event.target.value,
        });
    }

    handleChangeTimePopUp = (event) => {
       console.log(event)
        this.setState({
            TimeRemaining: event.target.value,
        });
    }

    handleChangeDatePopUp = (event) => {
        this.setState({
            date: event.target.value,
        });
    }

    render() {

        return (

            <Card style={{ width: 700, margin: 20 }}>
             
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Choose time and date </DialogTitle>
                    <DialogContent>
                     
                            Time : <input
                                id="time"
                                type="time"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                list="0—9"
                                onChange={this.handleChangeTimePopUp}
                                value={this.state.TimeRemaining}

                            />
                            <br></br>
                            Date : <TextField
                                id="date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.handleChangeDatePopUp}
                                value={this.state.date}
                            />
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.PostTimeToServer} color="primary" autoFocus>
                            Complete Booking
                        </Button>
                    </DialogActions>
                </Dialog>
                <div>
                    <TimerMachine
                        width="18px;"
                        timeStart={1 * 1000} // start at 1 seconds
                        started={this.state.started}
                        paused={this.state.paused}
                        resumed={this.state.resumed}
                        stopped={this.state.stopped}
                        interval={1000} // tick every 1 second
                        formatTimer={(time, ms) =>
                            moment.duration(ms, "milliseconds").format("h:mm:ss")
                        }
                        onTick={time => {

                            this.setState({
                                TimeRemaining: time.h + ':' + time.m + ':' + time.s
                            })
                        }
                        }
                    />
                    <div>
                        <Button style={{ margin: 2 }} variant="outlined" color="primary" onClick={this.StartTimer}>Start timer</Button>
                        <Button style={{ margin: 2 }} variant="outlined" color="primary" onClick={this.PauseTimer}>Pause timer</Button>
                        <Button style={{ margin: 2 }} variant="outlined" color="primary" onClick={this.ResumeTimer}>Resume timer</Button>
                        <Button style={{ margin: 2 }} variant="outlined" color="primary" onClick={this.StopTimer}>Stop timer</Button>
                    </div>
                </div>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Description"
                    multiline
                    rowsMax="4"
                    margin="normal"
                    helperText="Write what you worked on "
                    variant="outlined"
                    value={this.state.description}
                    onChange={this.handleChangeDescription}
                />
                <br></br>
                <Button style={{ margin: 2 }} variant="outlined" color="primary" onClick={this.BookTime}>Book time</Button>

            </Card>


        )
    }
}
export default TimeTracker 