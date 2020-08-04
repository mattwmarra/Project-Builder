import React, {useState, useEffect} from 'react';
import { Card, Container, Col, Row, Button } from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/v4';
import { get } from 'jquery';
const axios = require('axios')

let itemsFromBackend = [
  {id: uuid(), content: 'First Task'},
  {id: uuid(), content: 'Second Task'}
]

const columnsFromBackend = {
    [uuid()]: {
      name : 'Requested',
      items: itemsFromBackend
    },
    [uuid()] : {
      name: 'In Progress',
      items : []
    },
    [uuid()] : {
      name: 'Done',
      items: []
    }
};

const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items:sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })

  }
  else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId] : {
        ...column,
        items: copiedItems
      }
    })
  }
}

const getTasksFromDatabase = () => {
  axios.get('/api', {

  })
  .then((res) => {
    //handle success
    
    let newItems = res.data.tasks;
    itemsFromBackend = newItems;
    console.log(res.data.tasks);
  })
  .catch((err)=>{
    //handle failure
    console.log("Error: ", err)
  })
}

const addTaskToColumn = (columns, setColumns, id) => {
  const column = columns[id];
  const newItem = {
    id:uuid(),
    content: "Next Task"
  }
  const columnItems = [...column.items];
  columnItems.splice(column.index, 0, newItem);
  setColumns({
    ...columns,
    [id] : {
      ...column,
      items: columnItems
    }
  })
  
}

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  useEffect(() => {
    getTasksFromDatabase()
  
  });

  return (
    <div className="App">
      <h1>Bug Tracker</h1>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        <Container>
          <Row>
            {Object.entries(columns).map(([id, column]) => {
              return (
                  <Droppable droppableId={id} key={id} style={{margin: 8}}>
                  {(provided, snapshot) => {
                    return(
                      <div>
                        <div style={{display:"flex"}}>
                            <h2>{column.name}</h2>
                            <Button size="sm" key={id} onClick={result => addTaskToColumn(columns, setColumns, id)}>Add Task</Button>
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
                          
                          {column.items.map((item, index) =>{
                            return (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <Category title={item.title} 
                                              content={item.content} 
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
