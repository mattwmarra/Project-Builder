import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Col } from "react-bootstrap";
import TaskCard from "../TaskCard";

function DroppableColumn({ _id, column }) {
  return (
    <Droppable droppableId={_id} key={_id}>
      {(provided, snapshot) => {
        return (
          <Col
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`column ${snapshot.isDraggingOver ? "dragOver" : ""}`}
          >
            {column.map((task, index) => {
              return (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      provided={provided}
                      snapshot={snapshot}
                    ></TaskCard>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Col>
        );
      }}
    </Droppable>
  );
}

export default DroppableColumn;
