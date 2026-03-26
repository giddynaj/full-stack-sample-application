import DanceabiltyChart from "./DanceabilityChart";
import { useFetchData } from "./useFetchData";

type SampleDataPoint = {
  id: string;
  x: number;
  y: number;
};

function Danceability() {
  const { data: danceabilityData } = useFetchData<SampleDataPoint[]>(
    "http://localhost:8000/danceability"
  );

  return (
    <>
      <DanceabiltyChart
        data={danceabilityData ?? []}
        margin={5}
        width={500}
        height={300}
      />
    </>
  );
}

export default Danceability;
