import Message from "../models/Message.js";

export const sendMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.create({
        project: req.body.projectId,
        sender: req.user.id,
        text: req.body.text,
      });

    const populated =
      await Message.findById(
        message._id
      ).populate(
        "sender",
        "name email"
      );

    const io =
      req.app.get("io");

    io.emit(
      "newMessage",
      populated
    );

    res.status(201).json(
      populated
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await Message.find({
        project:
          req.params.projectId,
      })
        .populate(
          "sender",
          "name email"
        )
        .sort({
          createdAt: 1,
        });

    res.status(200).json(
      messages
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};