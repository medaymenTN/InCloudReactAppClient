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
import { Link } from 'react-router-dom'
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
            hours: '',
            minutes: '',
            seconds: '',
            isStarted: false,
            startedTimeStep: 0
        }

        this.StartTimer = this.StartTimer.bind(this);
        this.PauseTimer = this.PauseTimer.bind(this);
        this.ResumeTimer = this.ResumeTimer.bind(this);
        this.StopTimer = this.StopTimer.bind(this);
        this.handleChangeDatePopUp = this.handleChangeDatePopUp.bind(this)
        this.handleChangeDescription = this.handleChangeDescription.bind(this)
        this.PostTimeToServer = this.PostTimeToServer.bind(this)


    }
    // this method start the time tracker
    StartTimer() {

        this.setState({
            started: true,
            isStarted: true

        });
    }
    // this method pause the time tracker
    PauseTimer() {
        this.setState({
            paused: true
        });
    }
    // this method resume the time tracker   
    ResumeTimer() {
        this.setState({
            paused: false
        });
    }
    // this method stop the time tracker
    StopTimer() {
        this.setState({
            started: false
        });
    }
    // this method open the pop up dialog to pick the time when the tracker is not started 
    handleClickOpen = () => {
        this.setState({ open: true });
    };
    // closing the dialog
    handleClose = () => {
        this.setState({ open: false });
    };
    // this method send http post to the server to persist data into database 
    BookTime = () => {
        //if the starter is not started open the dialog to set the date and the time manually 
        if (!this.state.isStarted) {
            this.handleClickOpen()

        } else {
            //post the time to server using http post request 
            this.PostTimeToServer()

        }
    }

    PostTimeToServer = () => {
        //set the timer to zero 
        this.setState({
            startedTimeStep: 0
        })
        // send the http request 
        axios.post(
            `${SERVER_BASE_URL}/tracker`,
            {
                userId: this.state.user.id,
                //concatenation of the date and the time to be suitable format to DateTime object in the webserver
                time: this.state.date + ' ' + this.state.TimeRemaining,
                description: this.state.description
            })
            .then(response => {
                alert('success')
            })
        //close the dialog after finishing the operation
        this.handleClose()

    }

    // set the description content from input 
    handleChangeDescription = (event) => {
        this.setState({
            description: event.target.value,
        });
    }

    // set the date content from input 
    handleChangeDatePopUp = (event) => {
        this.setState({
            date: event.target.value,
        });
    }

    render() {

        return (

            <Card style={{ width: 700, margin: 20 }}>
                <Link to={`/TimeList`} >Display all times registred </Link>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Choose time and date </DialogTitle>
                    <DialogContent>

                        Time :
                        <br></br>
                        H:
                        <input
                            type="number"
                            style={{ width: 50 }}
                            min="0"
                            onChange={(e) => {
                                //if the hours are less then 10 add leading zero to the variable 
                                e.target.value < 10 ?
                                    this.setState({ hours: "0" + e.target.value }) :
                                    this.setState({ hours: e.target.value })
                            }}
                        />
                        m
                        <input
                            type="number"
                            style={{ width: 50 }}
                            min="0"
                            max="60"
                            onChange={(e) => {
                                e.target.value < 10 ?
                                    //if the minutes are less then 10 add leading zero to the variable 
                                    this.setState({ minutes: "0" + e.target.value }) :
                                    this.setState({ minutes: e.target.value })
                            }}
                        />
                        s
                        <input
                            type="number"
                            style={{ width: 50 }}
                            min="0"
                            max="60"
                            onChange={(e) => {
                                e.target.value < 10 ?
                                    //if the seconds are less then 10 add leading zero to the variable 
                                    this.setState({ seconds: "0" + e.target.value }) :
                                    this.setState({ seconds: e.target.value })
                            }}
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
                        <Button onClick={() => {
                            //concate all the variables to TimeRemaining to be in the format HH:MM:SS
                            // when the variable is set we recal postTimeToServer method using a callback function
                            this.setState({
                                TimeRemaining: this.state.hours + ':' + this.state.minutes + ':' + this.state.seconds
                            },
                                () => {
                                    this.PostTimeToServer()
                                }
                            )
                        }}
                            color="primary" autoFocus>
                            Complete Booking
                        </Button>
                    </DialogActions>
                </Dialog>
                <div>
                    <TimerMachine
                        width="18px;"
                        timeStart={this.state.startedTimeStep * 1000} // start at 1 seconds
                        started={this.state.started}
                        paused={this.state.paused}
                        resumed={this.state.resumed}
                        stopped={this.state.stopped}
                        interval={1000} // tick every 1 second
                        formatTimer={(time, ms) =>
                            moment.duration(ms, "milliseconds").format("h:mm:ss")
                        }
                        onTick={time => {
                            //concat hours , minutes , seconds from the TimeMachine component to have the format HH:MM:SS
                            if (time.h || time.m || time.s < 10) {

                                //adding leading zero if hours, minutes or seconds value are less than 10
                                time.h = '0' + time.h
                                time.m = ':0' + time.m
                                time.s = ':0' + time.s

                            }

                            this.setState({

                                TimeRemaining: time.h + time.m + time.s
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