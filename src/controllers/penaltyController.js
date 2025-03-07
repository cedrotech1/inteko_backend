import db from "../database/models/index.js";
const { Penalties,Users,Posts,Notifications,Attendances } = db;

// Helper function to send notifications
const sendNotification = async (userID, title, message, type) => {
  try {
    await Notifications.create({ userID, title, message, type });
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};



export const createPenalty = async (req, res) => {
  const { postID, penarity } = req.body;

  if (!postID || !penarity) {
    return res.status(400).json({ message: "Both postID and penalty are required." });
  }

  if (!req.user || !req.user.village_id) {
    return res.status(403).json({ message: "Unauthorized: Missing user village information." });
  }

  const village_id = req.user.village_id;

  try {
    console.log("Request Body:", req.body);

    // Step 1: Check if the post exists
    const post = await Posts.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Step 2: Get all citizens in the village
    const usersInVillage = await Users.findAll({
      where: { village_id: village_id, role: "citizen" },
     
    });

    if (usersInVillage.length === 0) {
      return res.status(404).json({ message: "No users found in this village." });
    }

    // Step 3: Get users who attended the post
    const attendedUsers = await Attendances.findAll({
      where: { postID: postID, attended: true },
      attributes: ["userID"],
    });

    const attendedUserIDs = attendedUsers.map((record) => record.userID);

    // Step 4: Filter out users who did not attend
    const nonAttendingUsers = usersInVillage.filter(
      (user) => !attendedUserIDs.includes(user.id)
    );

    if (nonAttendingUsers.length === 0) {
      return res.status(409).json({ message: "All users attended. No penalties needed." });
    }

    // Step 5: Create penalties & send notifications
    const penalties = [];
    for (const user of nonAttendingUsers) {
      const existingPenalty = await Penalties.findOne({
        where: { userID: user.id, postID: postID },
      });

      if (!existingPenalty) {
        const penaltyRecord = await Penalties.create({
          userID: user.id,
          postID: postID,
          penarity: penarity,
          status: "offered",
        });
        penalties.push(penaltyRecord);

        // Send Notification
        await sendNotification(
          user.id,
          "Penalty Assigned",
          `Dear ${user.firstname}, you have been assigned a penalty of ${penarity} for missing the event.`,
          "penalty"
        );
      }
    }

    if (penalties.length === 0) {
      return res.status(409).json({ message: "Penalties already exist for non-attending users." });
    }

    // Notify all users in the village about the penalties
    for (const user of usersInVillage) {
      await sendNotification(
        user.id,
        "Penalty Announcement",
        `Penalties have been assigned to those who missed the event.`,
        "penalty"
      );
    }

    return res.status(201).json({ message: "Penalties created and notifications sent", penalties });
  } catch (error) {
    console.error("Error creating penalties: ", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



// Get all penalties with user and post details
export const getAllPenalties = async (req, res) => {
  try {
    const penalties = await Penalties.findAll({
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post"},
      ],
    });

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};

// Get a specific penalty by ID
export const getPenaltiesByUserId = async (req, res) => {
  try {
    console.log(req.user.id)
    const  userID = req.user.id; // Get userID from request params

    // Find all penalties for the given user
    const penalties = await Penalties.findAll({
      where: { userID }, 
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({ message: "No penalties found for this user." });
    }

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};









// Delete a penalty
export const deletePenalty = async (req, res) => {
  try {
    const { id } = req.params;

    const penalty = await Penalties.findByPk(id);

    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    await penalty.destroy();

    await sendNotification(penalty.userID, "Penalty Removed", "Your penalty record has been deleted.", "penalty");

    res.status(200).json({ message: "Penalty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting penalty", error: error.message });
  }
};


export const getPenaltiesByUser = async (req, res) => {
  try {
    console.log(req.user)
    const userID = req.user.id; // Correctly extract user ID
    console.log(userID)

    const penalties = await Penalties.findAll({
      where: { userID }, // Filter penalties by userID
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({ message: "No penalties found for this user." });
    }

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user penalties", error: error.message });
  }
};

export const getAllPenaltiesUser = async (req, res) => {
  try {
    const penalties = await Penalties.findAll({
      where: { userID:req.user.id },
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post"},
      ],
    });

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};

export const updatePenaltyStatus = async (req, res) => {
  const { id } = req.params; // Get penalty ID from URL params
  const { status } = req.body; // Get new status from request body

  if (!status) {
    return res.status(400).json({ message: "Status field is required." });
  }

  try {
    // Check if the penalty exists
    const penalty = await Penalties.findByPk(id, { include: [{ model: Users, as: "user" }] });
    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found." });
    }

    // Update the penalty status
    penalty.status = status;
    await penalty.save();

    // Define notification message based on status
    let title = "Penalty Update";
    let message = "";

    if (status === "offered") {
      message = "You have been fined. Please report to the village to resolve your penalty.";
    } else if (status === "accepted") {
      message = "Congratulations! Your penalty has been resolved.";
    } else {
      message = `Your penalty status has been updated to ${status}.`;
    }

    // Send notification to user
    await sendNotification(penalty.userID, title, message, "penalty");

    return res.status(200).json({ message: "Penalty status updated successfully", penalty });
  } catch (error) {
    console.error("Error updating penalty status: ", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
