// Server entry - Uzhaivo
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req,res) => res.json({message: "Uzhaivo API Running"}));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
export default app;
