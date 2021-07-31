export default function handler(req, res) {
  const { image } = req.query;
  res.redirect(`${process.env.NEXT_PUBLIC_STRAPAPOO_URL}/uploads/${image}`);
}
