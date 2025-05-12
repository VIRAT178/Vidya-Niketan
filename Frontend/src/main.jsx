import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RNEg32fP6Jl0gWNwe3VlbjnWGjRtDxHs5qqEjX42nW0l9UGQ4Fhay5hq7pByiYv2nseyVJlDo3oQMgcsA00Gsvw00lycke62l"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);