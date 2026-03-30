import DanceabiltyChart from "./DanceabilityChart";
import { useFetchData } from "./useFetchData";
import { API_BASE_URL } from "./config";

type SampleDataPoint = {
  id: string;
  x: number;
  y: number;
};

function Danceability() {
  const { data: danceabilityData } = useFetchData<SampleDataPoint[]>(
    `${API_BASE_URL}/danceability`
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
