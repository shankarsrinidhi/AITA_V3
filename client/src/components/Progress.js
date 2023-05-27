import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import React, { Fragment, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


import { SortableItem } from './SortableItem';

function Progress(){
  const [languages, setLanguages ] = useState(["JavaScript", "Python", "TypeScript"]);

  function handleDragEnd(event) {
    console.log("Drag end called");
    const {active, over} = event;
    console.log("ACTIVE: " + active.id);
    console.log("OVER :" + over.id);

    if(active.id !== over.id) {
      setLanguages((items) => {
        const activeIndex = items.indexOf(active.id);
        const overIndex = items.indexOf(over.id);
        console.log(arrayMove(items, activeIndex, overIndex));
        return arrayMove(items, activeIndex, overIndex);
        // items: [2, 3, 1]   0  -> 2
        // [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1] 
      });
      
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Container className="p-2" style={{"width": "100%"}}>
        <h3>The best programming languages!</h3>
        <SortableContext
          items={languages}
          strategy={verticalListSortingStrategy}
        >
         
          {languages.map(language => 
          <SortableItem key={language} id={language}>
            checking
          </SortableItem>
            )}
        </SortableContext>
      </Container>
    </DndContext>
  );

  
}

export default Progress;