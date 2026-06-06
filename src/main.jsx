import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { ToastProvider } from "./components/ui/Toast.jsx"
import BackToTop from "./components/ui/BackToTop.jsx"
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><ToastProvider><App /><BackToTop /></ToastProvider></React.StrictMode>)