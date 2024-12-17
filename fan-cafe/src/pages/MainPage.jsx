import React from "react";
import MainCarousel from "../components/MainCarousel";
import TopRate from "../components/TopRate";

const MainPage = () => {
  return (
    <div>
      <MainCarousel />
      <div className="container">
        <TopRate></TopRate>
      </div>
    </div>
  );
};

export default MainPage;
