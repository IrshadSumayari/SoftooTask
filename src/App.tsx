import { Heatmap } from "./Heatmap";
import "./App.css";
import * as React from "react";
import { staticData } from "./data";

function App() {
  const [data, setData] = React.useState<{ x: any; y: any; value: string }[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.status === "success") {
          // Transform the data according to the graph structure
          const transformedData = responseData.data.map((item: any) => {
            if (item.minute_window) {
              const parts = item.minute_window.split(" ");
              if (parts.length >= 2) {
                const timePart = parts[1].split(":").slice(0, 2).join(":"); // Extract hours and minutes
                const value = `${item.sourceTag}`;
                return { x: timePart, y: item.date, value };
              }
            }
            return { x: "", y: "", value: "" };
          });

          setData(transformedData);
          setLoading(false);
        } else {
          setError("API response is not success");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        // setError("An error occurred while fetching data");

        // Comment/Remove this code when cors issue is fixed from backend and uncomment the above line.
        // Right now the data is loading from "data.ts" file to render the UI.
        const transformedData = staticData.map((item: any) => {
          if (item.minute_window) {
            const parts = item.minute_window.split(" ");
            if (parts.length >= 2) {
              const timePart = parts[1].split(":").slice(0, 2).join(":"); // Extract hours and minutes
              const value = `${item.sourceTag}`;
              return { x: timePart, y: item.date, value };
            }
          }
          return { x: "", y: "", value: "" };
        });
        setData(transformedData);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Heatmap data={data} width={700} height={400} />
      )}
    </>
  );
}

export default App;
