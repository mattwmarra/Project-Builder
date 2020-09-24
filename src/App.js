import React, {useState, useEffect} from 'react';
import { Card, Button, Popover, Form, Accordion, Badge } from 'react-bootstrap';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import Budget from './Budget'
import Login from './Login'
import { Board } from './Board';
import {useSelector} from 'react-redux'
const axios = require('axios')

const addTaskToColumn = (columns, setColumns, _id, values) => {
  console.log(values)
  const column = columns[_id];

  axios.post("/addTask", {
    title: values.title,
    content : values.description,
    parentID : _id
  }).then((res) =>{
    console.log(res.data)
    const newItem = res.data
    console.log(res.data)
    const columnItems = [...column.tasks];
    columnItems.splice(column.index, 0, newItem);
    setColumns({
      ...columns,
      [_id] : {
        ...column,
        tasks: columnItems
      }
    })
  })
}

export const EditCardPopover = (props) => {
   const [values, setValues] = useState({
    title : "",
    description : ""
  })
  const {columns, setColumns, _id} = props;

  return(
      <div>
        <Popover>
          <Popover.Title>Add Task</Popover.Title>
          <Popover.Content>
            <Form>
              <Form.Text>Task Title</Form.Text>
              <Form.Control id="title" onChange={(event) => setValues({
                title : event.target.value,
                description : values.description
                })} value={values.title}></Form.Control>
              <Form.Text>Task Description</Form.Text>
              <Form.Control id="description" placeholder="(Optional)" onChange={(event) => setValues(
                { title: values.title,
                  description : event.target.value})}></Form.Control>
              <Button onClick={() => {addTaskToColumn(columns, setColumns,_id, values)}}>Add</Button>
            </Form>
          </Popover.Content>
        </Popover>
      </div>
  )
}

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


export const Category = (props) => {

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
          editTitle : true
        })
        break
      }
      case "content" : {
        setState({
          ...state,
          editContent : true
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
                <Badge variant= {setPriorityColor(state.props.priority) } >Priority: {state.props.priority}</Badge>
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
