import React, {useState, useEffect} from 'react';
import { Card, Container, Col, Row, Button } from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/v4';
import { get } from 'jquery';
const axios = require('axios')

let columnsFromBackend = {
    // "first" : {
    //   name : 'Requested',
    //   tasks: [{
    //     _id : "123",
    //     title: "djksahd",
    //     content: "dkjhsad"
    //   }]
    // },
    // [uuid()] : {
    //   name: 'In Progress',
    //   tasks : []
    // },
    // [uuid()] : {
    //   name: 'Done',
    //   tasks: []
    // }
};
//5f29b201af027a1c9490f480
// 5f29b207af027a1c9490f481
const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
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

const getTasksFromDatabase = (columns, setColumns) => {
  axios.get('/api', {
  })
  .then((res) => {
    let [data] = res.data;
    console.log(data);
    const dataColumns = data.columns;
    console.log(dataColumns)
    let newState = {};

    for(const key of dataColumns){
      let x = data.tasks.filter(obj => {
        return (obj.parent === key._id);
      })
      console.log({x})
      newState[key._id] = {
        _id : key._id,
        name : key.name,
        tasks : data.tasks.filter(obj => {return (obj.parent === key._id);})
        //pull the tasks from tasks array by using the reference keys in the column.tasks array
      }
    }
    console.log(newState)
    setColumns(newState)
  })

  .catch((err)=>{
    //handle failure
    console.log("Found Error: ", err)
  })
}

const addTaskToColumn = (columns, setColumns, _id) => {

  const column = columns[_id];
  const newItem = {
    _id: uuid(),
    title : "Another Task!",
    content: "Added Text"
  }
  const columnItems = [...column.tasks];
  columnItems.splice(column.index, 0, newItem);
  setColumns({
    ...columns,
    [_id] : {
      ...column,
      tasks: columnItems
    }
  })
}

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  useEffect(() => {
    getTasksFromDatabase(columns, setColumns)

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
                    return(
                      <div>
                        <div style={{display:"flex"}}>
                            <h3>{column.name}</h3>
                            <Button size="sm" key={_id} onClick={() => addTaskToColumn(columns, setColumns, _id)}>Add Task</Button>
                        </div>
                      <Col {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          margin: 8,
                          width: 250,
                          minHeight: 500
                        }}
                        >
                          
                          {column.tasks.map((task, index) =>{
                            return (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <Category title={task.title} 
                                              content={task.content} 
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
          ref={props.provided.innerRef}
          {...props.provided.draggableProps}
          {...props.provided.dragHandleProps}
          style={{userSelect:'none',
          margin: 8,
          backgroundColor : props.snapshot.isDragging ? "#0984e3" : "#dfe6e9",
          ...props.provided.draggableProps.style
        }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.content}</Card.Text>
        </Card.Body>
      </Card> 
    </div>

  )
}

export default App;
