import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import  supabase  from "../supabaseClient";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {

  return(
    <div className="container-fluid mt-4">
      <h3>Sin información</h3>
    </div>
  );
}