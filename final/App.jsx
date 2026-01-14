import { useState } from "react";
import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import "./app.css";

export default function App() {
  const [bgClass, setBgClass] = useState("mild");

  return (
    <div className={`app ${bgClass}`}>
      <div className="page">
        <Header />
        <Content onThemeChange={setBgClass} />
        <Footer />
      </div>
    </div>
  );
}
