import React from "react";
import { LoginPage } from "./views/Login";
import { DashboardPage } from "./views/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

export default class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter basename={process.env.NODE_ENV === "production" ? "/PrismBackend" : ""}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    );
  }
}
