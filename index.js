const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-53235234",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Kikki Hiiri",
    number: "123-123123",
  },
];

// app.get("/", (req, res) => {
//   res.send("<h1>Hello World!</h1>");
// });

// app.get("/info", (req, res) => {
//   const count = persons.length;
//   const date = new Date();
//   res.send(`<p>Phonebook has info for ${count} people</p>
//   <p>${date}</p>`);
// });

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = {
    name: body.content,
    number: body.number,
    id: generateId(),
  };
  console.log(person);
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }
  if (persons.filter((e) => e.name === person.name).length > 0) {
    return response.status(400).json({
      error: "name already found",
    });
  }
  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
