import React, {useState} from 'react';
import { Card, Container, Col, Row } from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/v4';

const itemsFromBackend = [
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
    console.log(sourceColumn)
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

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

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
                        <h2>{column.name}</h2>
                      <Col {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          margin: 16,
                          width: 250,
                          minHeight: 500
                        }}
                        >
                          
                          {column.items.map((item, index) =>{
                            return (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{userSelect:'none',
                                        margin: 8,
                                        backgroundColor : snapshot.isDragging ? "#0984e3" : "#dfe6e9",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      <Card.Title>{item.content}</Card.Title>
                                      <Card.Text>Details</Card.Text>
                                      </Card>
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
      <Card>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card> 
    </div>

  )
}

export default App;
