export default async function handler(req, res) {
  const { uid } = req.query;
  const apiKey = process.env.GAMESKINBO_API_KEY;

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

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "GAMESKINBO_API_KEY is missing in Vercel"
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

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        upstreamStatus: response.status,
        message: "GamesKinbo API error",
        response: data
      });
    }

    const name = data?.AccountInfo?.AccountName;

    return res.status(200).json({
      success: true,
      uid: uid,
      name: name || null,
      region: data?.AccountInfo?.AccountRegion || "BD"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message
    });
  }
}
