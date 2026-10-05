export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid || !/^\d+$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "Valid UID is required"
    });
  }

  try {
    const response = await fetch(
      `https://api2.nftoken.info/get?uid=${encodeURIComponent(uid)}&region=BD`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Player lookup failed",
        response: data
      });
    }

    return res.status(200).json({
      success: true,
      uid,
      name: data?.AccountInfo?.AccountName || data?.basicInfo?.nickname || null,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
