import axios from "axios";

const API =
  "http://localhost:5000/api/reports";

export const downloadReport = async (
  projectId
) => {
  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    `${API}/${projectId}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const url =
    window.URL.createObjectURL(
      new Blob([response.data])
    );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "project-report.pdf";

  document.body.appendChild(link);

  link.click();
};

console.log(
  localStorage.getItem("token")
);