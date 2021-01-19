import React, {useState, useEffect} from 'react';
import { Card, Button, Popover, Form, Accordion, Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import Budget from './Budget'
import Login from './Login'
import { Board } from './Board';
import {useSelector, useDispatch} from 'react-redux'
import {renameTask} from './actions'
import './styles.scss'
const axios = require('axios')

function App() {
  const [columns, setColumns] = useState([]);
  const isLogged = useSelector(state => state.isLogged)
  if(!isLogged){
    return(
      <div>
        <Switch>
          <Route path="/login" component={() => <Login></Login>}></Route>
        </Switch>
        <Redirect to="/login"></Redirect>
      </div>
    )
  }
  return (
    <div className="App">
          <NavBar projectName={"This Project"}></NavBar>
          <Switch>
            <Route exact path="/board" component={() => <Board columns={columns} setColumns={setColumns}></Board>}></Route>
            <Route exact path="/budget" component={() => <Budget></Budget>}></Route>
            <Route exact path="/dashboard" component={() => <Dashboard></Dashboard>}></Route>
          </Switch>
    </div>
  );
}


export const TaskCard = (props) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    editTitle : false,
    editContent : false,
    props : props.task,
    tempData : props.task

  })

  const setPriorityColor = (priority) => {
    switch(priority) {
      case "low" : {
        return 'success'
      }
      case "medium" : {
        return 'warning'
      }
      case "high" : {
        return "danger"
      }
      default : {
        return 'primary'
      }
    }
  }

  const handleDoubleClick = (e) => {
    console.log(e.target)
    switch(e.target.id){
      case "title" : {
        setState( {
          ...state,
          editContent : false,
          editPriority : false,
          editTitle : !state.editTitle
        })
        break
      }
      case "priority" : {
        setState({
          ...state,
          editContent : false,
          editTitle : false,
          editPriority : !state.editPriority
        })
        break
      }
      case "content" : {
        setState({
          ...state,
          editContent : !state.editPriority,
          editTitle : false,
          editPriority : false
        })
        break
      }
      default: {
          //do nothing
      }
    }
  }

  const handleKeyPress = (e) => {
    let editField = "edit" + e.target.id[0].toUpperCase()+e.target.id.slice(1);
    if(e.key === 'Enter'){   
       setState( {
      ...state,
      [editField] : false
    })
      axios.post('/updateTasks', {
        updatedTask : state.props
      }).then((res) =>{
        console.log(res.data)
      });
      dispatch(renameTask(state.props))
    }
    else if(e.key === "Escape") {
      setState({
        props : state.tempData,
        [editField] : false
      })
    }
  }

  const handleChange = (e) => {
    let field = e.target.id;
    setState ({
      ...state,
      props : {
        ...props.task,
        [field] : e.target.value
      }
    })
  }
  return(
    <div>
      <Card
          id={props.task.id}
          bg={setPriorityColor(state.props.priority)}
          text={setPriorityColor(state.props.priority) === 'light' ? 'dark' : 'white'}
          ref={props.provided.innerRef}
          {...props.provided.draggableProps}
          {...props.provided.dragHandleProps}
          style={{userSelect:'none',
          margin: 8,
          backgroundColor : "#fff",
          // boxShadow: props.snapshot.isDragging ? "10px 10px 5px -4px rgba(97,97,97,0.37)" : "none",
          ...props.provided.draggableProps.style
        }}>
        <Accordion>
          <div>
            {!state.editTitle 
                ?                   
                <Card.Header id={"title"} onDoubleClick={handleDoubleClick} 
                  style={{width: "100%", display : "flex", justifyContent:"space-between"}}>
                  {state.props.title}
                  <Accordion.Toggle as={Button} variant="link" style= {{color : "#ffffff"}}eventKey="0" size="sm">More</Accordion.Toggle>
                </Card.Header>
                : 
                <Card.Header onKeyPress={handleKeyPress} onChange={handleChange} >
                  <Form.Control id={"title"} placeholder={props.task.title}></Form.Control>
                </Card.Header>
            }
          </div>
            <Accordion.Collapse eventKey="0">
                <Card.Body background='white'>
                {!state.editPriority? 
                  <Badge id={"priority"} onDoubleClick={handleDoubleClick}variant={setPriorityColor(state.props.priority)} >Priority: {state.props.priority}</Badge>
                  :
                  <DropdownButton title="Priority" variant={setPriorityColor(state.props.priority)}>
                    <Dropdown.Item>Low</Dropdown.Item>
                    <Dropdown.Item>Medium</Dropdown.Item>
                    <Dropdown.Item>High</Dropdown.Item>
                  </DropdownButton>
                }
                <Card.Subtitle>{props.task.lastMovedDate !== undefined ? props.task.lastMovedDate : "N/A"}</Card.Subtitle>
                {!state.editContent?
                  <Card.Text id={"content"} onDoubleClick={handleDoubleClick}>{state.props.content} </Card.Text>
                  :
                  <Form.Control id={"content"} placeholder={props.task.content} onKeyPress={handleKeyPress} onChange={handleChange}></Form.Control>
                }

              </Card.Body>
            </Accordion.Collapse>

        </Accordion>
      </Card> 
    </div>
  )
}
export default withRouter(App);
