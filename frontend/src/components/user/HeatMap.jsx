import React, { useEffect, useState } from "react";
import "./profile.css";
import HeatMap from "@uiw/react-heat-map"

const genrateActivityData = (startDate, endDate) => {
  const data = [];
  let CurrDate = new Date(startDate);
  let EndDate = new Date(endDate);

  while (CurrDate <= EndDate) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: CurrDate.toISOString().split("T")[0], count: count,//YY-MM-DD
    });
    CurrDate.setDate(CurrDate.getDate() + 1)
  }
  return data;
}


const getPanelColors = (maxCount) => {
  const Colors = [];

  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);

    Colors.push(`rgb(0, ${greenValue}, 0)`);
  }

  return Colors;
};

const HeatMapProfile = () => {
  const [activeData, setActiveData] = useState([]);
  const [panelColors, setPannelColors] = useState({});

  useEffect(() => {
    const fatchData = async () => {
      const startDate = '2025-07-23';
      const endDate = '2026-08-22';
      const data = genrateActivityData(startDate, endDate);
      setActiveData(data)

      const maxCount = Math.max(...data.map((d) => d.count));
      setPannelColors(getPanelColors(maxCount))
    }
    fatchData()
  }, []);
  return (
    <div>
      <h4 >Recent Contributions0</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ width: "500px", height: "200px", color: "white" }}
        value={activeData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date("2025-07-23")}
        rectSize={20}
        space={3}
        rectProps={{
          rx: 4.5
        }}
        panelColors={panelColors}
      />
    </div>
  )
}
export default HeatMapProfile;