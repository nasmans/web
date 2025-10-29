import "./styles.css";
import { renderDashboard } from "./dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (root) {
    renderDashboard(root);
  }
});
