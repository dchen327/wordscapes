import { useState } from "react";

const Crossword = () => {
  const [crossword, setCrossword] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    // setCrossword(data);
    console.log(data);
  };

  return (
    <div>
      <button onClick={fetchCrossword}>Fetch Crossword</button>
    </div>
  );
};

export default Crossword;
