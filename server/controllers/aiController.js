export const generateTasks = async (req, res) => {
  try {
    const { projectTitle } = req.body;

    const tasks = [
      {
        title: `Setup ${projectTitle} Project`,
        description: `Initialize and configure ${projectTitle}`,
        status: "Pending",
      },
      {
        title: "Create Authentication Module",
        description: "Implement login and registration",
        status: "Pending",
      },
      {
        title: "Build Dashboard UI",
        description: "Design and develop dashboard screens",
        status: "In Progress",
      },
      {
        title: "Implement CRUD Operations",
        description: "Add create, read, update and delete functionality",
        status: "Pending",
      },
      {
        title: "Testing & Deployment",
        description: "Test application and deploy to production",
        status: "Completed",
      },
    ];

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};