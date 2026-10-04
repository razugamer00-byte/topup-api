export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "UID is required"
    });
  }

  if (!/^\d+$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "Invalid UID"
    });
  }

  try {
    const response = await fetch(
      `https://api.gameskinbo.com/ff-info/get?uid=${encodeURIComponent(uid)}&region=BD`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.GAMESKINBO_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.error || "Player lookup failed"
      });
    }

    const playerName = data?.AccountInfo?.AccountName;

    if (!playerName) {
      return res.status(404).json({
        success: false,
        message: "Player name not found"
      });
    }

    return res.status(200).json({
      success: true,
      uid: uid,
      name: playerName,
      region: data?.AccountInfo?.AccountRegion || "BD"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
