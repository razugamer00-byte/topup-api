export default async function handler(req, res) {
  const { uid } = req.query;
  const apiKey = process.env.FREEFIRE_API_KEY;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "UID is required"
    });
  }

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "FREEFIRE_API_KEY is missing"
    });
  }

  try {
    const response = await fetch(
      `https://api.gameskinbo.com/ff-info/get?uid=${encodeURIComponent(uid)}&region=BD`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "Accept": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "GamesKinbo API error",
        status: response.status,
        response: data
      });
    }

    return res.status(200).json({
      success: true,
      uid: uid,
      name: data?.AccountInfo?.AccountName || null,
      region: data?.AccountInfo?.AccountRegion || "BD"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Request failed",
      error: error.message
    });
  }
}
