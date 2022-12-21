import { useCallback, useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { onValue, ref, set, update } from 'firebase/database';

import { db } from './firebase';
import './styles.css';

const positionRef = ref(db, 'position');
const handlerSize = 16; // size of drag handler

function App() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const unsubscribe = useRef();

  const onWindowSizeChange = useCallback(() => {
    const width = window.innerWidth - handlerSize;
    const height = window.innerHeight - handlerSize;

    setPos((prevVal) => {
      const x = Math.min(prevVal.x, width);
      const y = Math.min(prevVal.y, height);

      update(positionRef, {
        x,
        y,
        width,
        height,
      });

      return { x, y };
    });    
  }, []);

  const onPositionChange = useCallback((snapshot) => {
    if (snapshot.val()) {
      const { width, height, x, y } = snapshot.val();

      setPos({
        x: x / width * (window.innerWidth - handlerSize),
        y: y / height * (window.innerHeight - handlerSize)
      });
    }
  }, []);

  useEffect(() => {
    unsubscribe.current = onValue(positionRef, onPositionChange);
    window.addEventListener('resize', onWindowSizeChange, true);

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }

      window.removeEventListener('resize', onWindowSizeChange, true);
    }
  }, [onWindowSizeChange, onPositionChange]);

  const onDragStart = () => {
    if (unsubscribe.current) {
      unsubscribe.current();
    }
  };

  const onDragging = (_, data) => {
    const { x, y } = data;

    setPos({ x, y });
    set(positionRef, {
      x,
      y,
      width: window.innerWidth - handlerSize,
      height: window.innerHeight - handlerSize,
    });
  };

  const onDragEnd = () => {
    unsubscribe.current = onValue(positionRef, onPositionChange);
  };

  return (
    <div className="App">
      <Draggable
        bounds="parent"
        handle=".drag-handler"
        position={pos}
        onStart={onDragStart}
        onDrag={onDragging}
        onStop={onDragEnd}
      >
        <div className="drag-handler" />
      </Draggable>
    </div>
  );
}

export default App;
