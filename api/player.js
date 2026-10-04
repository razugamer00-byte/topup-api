export default function handler(req, res) {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "UID is required"
    });
  }

  return res.status(200).json({
    success: true,
    uid: uid,
    name: "TEST PLAYER"
  });
}
