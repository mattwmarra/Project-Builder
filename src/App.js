import React, {useState, useEffect} from 'react';
import { Card, Container, Col, Row, Button, Popover, Form, OverlayTrigger } from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
const axios = require('axios')

const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    let [removed] = sourceItems.splice(source.index, 1);

    removed.parent = destination.droppableId
    destItems.splice(destination.index, 0, removed);
    axios.post('/updateTasks', {
      updatedTask : removed
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks:sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destItems
      }
    })


  }
  else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.tasks]
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId] : {
        ...column,
        tasks: copiedItems
      }
    })
  }
}

const getTasksFromDatabase = ( setColumns) => {
  axios.get('/api', {
  })
  .then((res) => {
    let [data] = res.data;
    console.log(res.data)
    const dataColumns = data.columns;
    let newState = {};
    console.log({data})
    for(const key of dataColumns){
      newState[key._id] = {
        _id : key._id,
        name : key.name,
        tasks : data.tasks.filter(obj => {return (obj.parent === key._id);}) //jankey fix, should be better once I learn aggregation better
        //pull the tasks from tasks array by using the reference keys in the column.tasks array
      }
    }
    setColumns(newState)
  
  })

  .catch((err)=>{
    //handle failure
    console.log("Found Error: ", err)
  })
}

const addTaskToColumn = (columns, setColumns, _id, values) => {
  const column = columns[_id];

  axios.post("/addTask", {
    title: values.title,
    content : values.description,
    parentID : _id
  }).then((res) =>{
    console.log(res.data)
    // const newItem = {
    //   _id: res.data._id,
    //   title : res.data.title,
    //   content: res.data.content,
    //   parent: res.data.parent
    // }
    const newItem = res.data
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

const EditCardPopover = (props) => {
   const [values, setValues] = useState({
    title : "",
    description : ""
  })

  console.log(props.columns)

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
              <Button onClick={() => addTaskToColumn(props.columns, props.setColumns, props._id, values, setValues)}>Add</Button>
            </Form>
          </Popover.Content>
        </Popover>
      </div>
  )
}

function App() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getTasksFromDatabase(setColumns)
  }, []);
  //[] is a currently empty list of values to check for changes of
  // this keeps the request from being repeatedly sent

  return (
    <div className="App">
      <h1>Bug Tracker</h1>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        <Container>
          <Row>
            {Object.entries(columns).map(([_id, column]) => {
              return (
                  <Droppable droppableId={_id} key={_id} style={{margin: 8}}>
                  {(provided, snapshot) => {
                    console.log({provided})
                    return(
                      <div>
                        <div style={{display:"flex"}}>
                            <h3>{column.name}</h3>
                            <OverlayTrigger trigger="click" overlay={<EditCardPopover />} placement="right" //can only use hooks "nested" by passing as a <Element/> idk why
                                            columns={columns} setColumns={setColumns} _id={_id}>
                              <Button size="sm" key={_id} >Add Task</Button>
                            </OverlayTrigger>

                        </div>
                      <Col {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 300,
                          margin: 16,
                          minHeight: 500
                        }}
                        >
                          
                          {column.tasks.map((task, index) =>{
                            return (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <Category 
                                              task={task}
                                              provided={provided} 
                                              snapshot={snapshot}>
                                      </Category>
                                  )
                                }}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                      </Col>
                      </div>
                    )
                  }}
                  </Droppable>
                )
                })}
        </Row>
        
        </Container>
      </DragDropContext>
    </div>
  );
}



const Category = (props) => {
  return(
    <div>
      <Card
          id={props.task.id}
          ref={props.provided.innerRef}
          {...props.provided.draggableProps}
          {...props.provided.dragHandleProps}
          style={{userSelect:'none',
          margin: 8,
          backgroundColor : "#fff",
          // boxShadow: props.snapshot.isDragging ? "10px 10px 5px -4px rgba(97,97,97,0.37)" : "none",
          ...props.provided.draggableProps.style
        }}>
        <Card.Body>
          <Card.Title>{props.task.title}</Card.Title>
          <Card.Subtitle>{props.task.lastMovedDate !== undefined ? props.task.lastMovedDate : "N/A"}</Card.Subtitle>
          <Card.Body>Details: {props.task.content}</Card.Body>
        </Card.Body>
      </Card> 
    </div>
  )
}

export default App;
