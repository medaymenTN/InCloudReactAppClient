import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemSecondaryAction } from '@material-ui/core';

import moment from "moment";
import axios from 'axios'

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Pagination from "material-ui-flat-pagination";

import { SERVER_BASE_URL } from '../configuration/Config';
import { Link } from 'react-router-dom'

const theme = createMuiTheme();


class TimesList extends Component {

  constructor() {
    super()
    this.state = {
      times: [],
      offset: 0,
      total: 0
    }
  }
  // calling the api when the component is mount and fetch all times 
  componentDidMount() {

    axios.get(`${SERVER_BASE_URL}/trackers`).then((Response) => {
    
      this.setState({
        times: Response.data.items,
        offset: Response.data.current_page,
        //adjusting pagination to load pages numbers according to itmes loaded 
        //math.round()  generate default  value of a float so that we add +1 one to get the right value
        total: Math.round(Response.data.total_count/5)+1
      })

    })


  }
  // handling pagination click and passing page number in parameters to the GET request as a query param
  handleClick(pageNumber) {
    axios.get(`${SERVER_BASE_URL}/trackers?page=${pageNumber}`).then((Response) => {

      this.setState({
        times: Response.data.items,
        offset: Response.data.current_page
      })

    })

  }

  render() {

    return (
      <div>
        <Link to={`/TimeTracker`} activeClassName="current">  Back</Link>
        <List>

          {
            //display all times using map()
            this.state.times.map((item, i) => {
              //using moment js to adjust datetime format 
              return <ListItem key={i}>

                <ListItemText primary={item.description} secondary={moment(item.time).utc(0).format("YYYY-MM-DD HH:mm:ss")} />
                <ListItemSecondaryAction>
                   Created By : {item.user.username}
                 </ListItemSecondaryAction>

                    </ListItem>


            })
          }


        </List>
        <div>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Pagination
              offset={this.state.offset}
              total={this.state.total}
              onClick={(e, offset) => this.handleClick(offset)}
            />
          </MuiThemeProvider>
        </div>
      </div>

    )
  }
}


export default TimesList 