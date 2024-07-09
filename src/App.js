import Register from "./components/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      <Register />
    </div>
  );
}

export default App;
