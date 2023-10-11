const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const port = 5000 | process.env.PORT;
const host = "localhost";

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.json({ message: "success!" });
});

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content)
    return res.status(400).send("title and content fields are required");

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (err) {
    res.status(500).send("Something went wrong!!");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Check if id is not a valid number
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID format");
  }

  if (!title || !content) {
    return res.status(400).send("Title and content fields are required");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id: parseInt(id) }, // Ensure the ID is an integer
      data: { title, content },
    });

    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  // Check if id is not a valid number
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    await prisma.note.delete({
      where: { id: parseInt(id) }, // Ensure the ID is an integer
    });

    res.status(204).send(); // Respond with a 204 No Content status (successful deletion)
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, host, () => {
  console.log(`server started on http://${host}:${port}`);
});
