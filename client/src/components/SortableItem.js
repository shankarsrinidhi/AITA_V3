import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";

export function SortableItem(props) {
    // props.id
    // JavaScript

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
             
            <Card  className="m-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {props.id}
                    <button className="btn3 float-right" onClick={() => {console.log("clicked mofo")}}>
                    <AiOutlineDelete style={{fontSize:'1.25rem', marginLeft:"1rem"}}></AiOutlineDelete>
                    </button>

                </div>
            </Card>
            <Card>

            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>
                
            </Card.Body>
            <Button variant="primary" onClick={() => console.log("clicked mofo")}>Click Me</Button>
            </Card>

            
        </div>
    )
}