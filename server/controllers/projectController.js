import Project from "../models/Project.js";


// CREATE PROJECT
export const createProject = async (req, res) => {
  try {

    const { title, description, status } = req.body;

    const project = await Project.create({
      title,
      description,
      status,
      user: req.user.id,
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      user: req.user.id,
    });

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check owner
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedProject);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check owner
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};