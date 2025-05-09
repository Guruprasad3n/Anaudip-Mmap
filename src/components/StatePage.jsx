import { useParams } from "react-router-dom";
import { useState } from "react";
import { studentsData } from "../data/data";
import FilterBox from "../components/FilterBox";
import "../Styles/statepage.css";

function StatePage() {
  const { stateName } = useParams();
  const [selectedCenters, setSelectedCenters] = useState([]);

  const stateStudents = studentsData.filter(
    (student) =>
      student["Center State"]?.toLowerCase() === stateName.toLowerCase()
  );

  const uniqueCenterCodes = [
    ...new Set(stateStudents.map((s) => s["Center Code"])),
  ];

  const filteredData =
    selectedCenters.length > 0
      ? stateStudents.filter((student) =>
          selectedCenters.includes(student["Center Code"])
        )
      : stateStudents;

  const centerSummary = {};

  filteredData.forEach((student) => {
    const centerCode = student["Center Code"];
    const centerName = student["Center Name"];
    const status = student["Student Status"]?.toLowerCase() || "";
    const finalExamMarks = student["Final Exam Marks"];

    if (!centerSummary[centerCode]) {
      centerSummary[centerCode] = {
        centerName,
        enrolled: 0,
        trained: 0,
        dropout: 0,
        placed: 0,
      };
    }

    const summary = centerSummary[centerCode];
    summary.enrolled += 1;

    if (finalExamMarks && !isNaN(finalExamMarks)) {
      summary.trained += 1;
    }

    if (status === "dropped out" || status === "dropped") summary.dropout += 1;
    if (status === "placed") summary.placed += 1;
  });

  const total = {
    enrolled: 0,
    trained: 0,
    dropout: 0,
    placed: 0,
  };

  Object.values(centerSummary).forEach((center) => {
    total.enrolled += center.enrolled;
    total.trained += center.trained;
    total.dropout += center.dropout;
    total.placed += center.placed;
  });

  return (
    <div className="state-container">
      <h1 className="state-title">{stateName} - Center Summary</h1>

      {uniqueCenterCodes.length > 0 ? (
        <div className="filter-box-container">
          <FilterBox options={uniqueCenterCodes} onChange={setSelectedCenters} />
        </div>
      ) : (
        <p>No center codes found for this state.</p>
      )}

      <table className="state-table">
        <thead>
          <tr>
            <th>Center Code</th>
            <th>Center Name</th>
            <th>Enrolled</th>
            <th>Trained</th>
            <th>Dropouts</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(centerSummary).map(([code, data]) => (
            <tr key={code}>
              <td>{code}</td>
              <td>{data.centerName}</td>
              <td>{data.enrolled}</td>
              <td>{data.trained}</td>
              <td>{data.dropout}</td>
              <td>{data.placed}</td>
            </tr>
          ))}

          <tr className="total-row">
            <td colSpan="2">TOTAL</td>
            <td>{total.enrolled}</td>
            <td>{total.trained}</td>
            <td>{total.dropout}</td>
            <td>{total.placed}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatePage;