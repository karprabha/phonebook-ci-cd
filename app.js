import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";

import Person from "./models/person.js";

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// eslint-disable-next-line no-unused-vars
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;

  try {
    const person = await Person.findById(personId);
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: "person not found" });
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;

  try {
    const person = await Person.findByIdAndDelete(personId);
    if (person) {
      res.status(204).end();
    } else {
      res.status(404).send({ error: "person not found" });
    }
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;
  const { name, number } = req.body;

  if (!name || !number) {
    res.status(400).json({
      error: "missing fields",
    });
    return;
  }

  const person = {
    name,
    number,
  };

  try {
    const updatedPerson = await Person.findByIdAndUpdate(personId, person, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (updatedPerson) {
      res.status(201).json(updatedPerson);
    } else {
      res.status(404).send({ error: "person not found" });
    }
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    res.status(400).json({
      error: "missing fields",
    });
    return;
  }

  try {
    const newPerson = new Person({
      name,
      number,
    });

    const person = await newPerson.save();
    res.status(201).json(person);
  } catch (err) {
    next(err);
  }
});

app.get("/health", async (req, res, next) => {
  try {
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.send(`  <p>
                    Phonebook has info of ${persons.length} peoples
                </p>
                <br>
                <p>
                    ${new Date()}
                </p>
    `);
  } catch (err) {
    next(err);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening to port: ${PORT}`);
});
