import User from "../models/User.js";
import Project from "../models/Project.js";
import sendEmail from "../utils/sendEmail.js";

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
    })
    .populate(
      "members",
      "name email profilePic"
    );
    
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

export const addMemberToProject = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      project.members.includes(
        user._id
      )
    ) {
      return res.status(400).json({
        message:
          "User already added",
      });
    }

    project.members.push(
      user._id
    );

    await project.save();
    await sendEmail(
  user.email,

  "You've Been Added To A Project 🚀",

  `
Hello ${user.name},

You have been added to the project:

${project.title}

Description:
${project.description}

Login to DevFlow AI and start collaborating with your team.

Regards,
DevFlow AI Team
`
);

    res.status(200).json({
      message:
        "Member added successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};