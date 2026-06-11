import PDFDocument from "pdfkit";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const exportProjectReport = async (
  req,
  res
) => {
  try {
    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      project: project._id,
    });

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${project.name}-report.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text("DevFlowAI Project Report");

    doc.moveDown();

    doc
      .fontSize(18)
      .text(`Project: ${project.name}`);

    doc.moveDown();

    doc.text(
      `Description: ${
        project.description || "N/A"
      }`
    );

    doc.moveDown();

    doc.text(
      `Total Tasks: ${tasks.length}`
    );

    doc.moveDown();

    tasks.forEach((task, index) => {
      doc.text(
        `${index + 1}. ${task.title}`
      );

      doc.text(
        `Status: ${task.status}`
      );

      doc.text(
        `Priority: ${
          task.priority || "Medium"
        }`
      );

      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};