export default function handler(req, res) {
  const { image } = req.query;
  res.redirect(`${process.env.STRAPAPOO_URL}/uploads/${image}`);
}
