import { useState, useEffect, useRef } from 'react';

const useOutSideClicked = (ref) => {
  const [isOutSide, setIsOutSide] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      setIsOutSide(ref.current && !ref.current.contains(event.target));
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return { isOutSide, setIsOutSide };
};

export default useOutSideClicked;
