import { useState, useEffect } from "react";
import DanceabiltyChart from "./DanceabilityChart";

type SampleDataPoint = {
  id: string;
  x: number;
  y: number;
};

function Danceability() {
  const sampleData: SampleDataPoint[] = [
    { id: "A", x: 0.08167, y: 0.0555 },
    { id: "B", x: 0.01492, y: 0.0555 },
  ];
  const [danceabilityData, setDanceabilityData] = useState([]);

  useEffect(() => {
    const fetchDanceData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/danceability`);
        if (!response.ok) {
          throw new Error("Failed to fetch danceability");
        }
        const data = await response.json();
        console.log("data eb", data.data);
        setDanceabilityData(data.data);
      } finally {
        //
      }
    };

    fetchDanceData();
  }, []);

  return (
    <>
      <DanceabiltyChart
        data={danceabilityData}
        margin={5}
        width={500}
        height={300}
      />
    </>
  );
}

export default Danceability;
