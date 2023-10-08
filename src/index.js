import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./board/Board";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
