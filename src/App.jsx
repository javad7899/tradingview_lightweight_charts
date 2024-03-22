
import Chart from "./components/Chart";
import initialData from "../data.json"


export default function App() {
  return <div className="App">
    <Chart data={initialData} />
  </div>
}