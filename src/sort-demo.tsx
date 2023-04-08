import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { sortByFirstToLast } from "traverselinkedlist";

interface Item {
  id: number;
  previous: number | null;
  next: number | null;
}

const INITIAL_ITEMS: Item[] = [
  {
    id: 1,
    previous: null,
    next: 2
  },
  {
    id: 2,
    previous: 1,
    next: 3
  },
  {
    id: 3,
    previous: 2,
    next: 4
  },
  {
    id: 4,
    previous: 3,
    next: null
  },
]

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Card({ item, index }: { item: Item, index: number }) {
  return (
    <Draggable draggableId={item.id + ''} index={index}>
      {provided => (
        <div
          className='card'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className='card-label'>
            ID: {item.id}
          </div>
          <div className='card-label'>
            Previous:
          </div>
          <div>
            {item.previous ?? 'null'}
          </div>
          <div className='card-label'>
            Next:
          </div>
          <div>
            {item.next ?? 'null'}
          </div>
        </div>
      )}
    </Draggable>
  );
}

const CardList = React.memo(function CardList({ quotes }: any) {
  return quotes.map((quote: Item, index: number) => (
    <Card item={quote} index={index} key={quote.id} />
  ));
});

function CardApp() {
  const [state, setState] = useState({ quotes: INITIAL_ITEMS });

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes: any = reorder(
      state.quotes,
      result.source.index,
      result.destination.index
    );

    setState({ quotes });
  }

  function onItemsReset() {
    const sorted = sortByFirstToLast(state.quotes, 'previous', 'next')
    setState({ quotes: sorted });
  }

  return (
    <>
      <div className='sort-column'>
        <h4>
          Reorder below items
        </h4>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {provided => (
            <div className='card-list' ref={provided.innerRef} {...provided.droppableProps}>
              <CardList quotes={state.quotes} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={onItemsReset}>
        Sort list
      </button>
    </>
  );
}

export default function SortDemo() {
  useEffect(() => {
    const rootElement = document.getElementById('items-column');
    ReactDOM.render(<CardApp />, rootElement);
  }, []);
  return (
    <div id='items-column'></div>
  );
}
