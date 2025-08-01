import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
 "pk_test_51RNDWeRpGgAy8mpYqy9LVvrOoDeknGV9esUcBBV70Gfy3G62SX6ppwaZrrQxlnbIZ8qFv47bHl5cq59pU59AaipX00BQio42II"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);