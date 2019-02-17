const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const port = 4000;
const cors = require('cors')
const host = "0.0.0.0";
const app = express();

const filePath = {
    cards: path.join(__dirname, "./data/cards.json"),
    categories: path.join(__dirname, "./data/categories.json")
};

const data = {
    cards: JSON.parse(fs.readFileSync(filePath.cards, "utf8")),
    categories: JSON.parse(fs.readFileSync(filePath.categories, "utf8"))
}

const injectData = (req, res, next) => {
    req.data = data;
    next();
}

app.use(cors());
app.use(bodyParser.json());
app.use(injectData)



function uuidv4(len = 32) {
    return "x".repeat(len).replace(/[x]/g, c => {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function saveData(data, type) {
    return fs.writeFileSync(filePath[type], JSON.stringify(data));
}

const avalaibleTypes = ['cards', 'categories'];

app.get("/", (request, response) => {
    try {
        return response.send(JSON.stringify(request.data));
    } catch (error) {
        return response.status(500).send(error.message);
    }
});

app.get("/:type", (request, response) => {
    const type = request.params.type;
    if (!avalaibleTypes.includes(type)) {
        return response.status(404).send(error.message);
    }
    try {
        return response.send(JSON.stringify(request.data[type]));
    } catch (error) {
        return response.status(500).send(error.message);
    }
});


app.get("/:type/:id", (request, response) => {
    const type = request.params.type;
    if (!avalaibleTypes.includes(type)) {
        return response.status(404).send("Invalid url!");
    }  
    try {
        const items = request.data[type];
        const item = items.filter( e => e.id === request.params.id );
        const result = item.length ? item[0] : false;
        return response.send(JSON.stringify(result));
    } catch (error) {
        return response.status(500).send(error.message);
    }
});

app.put("/:type", async (request, response) => {
    const type = request.params.type;
    if (!avalaibleTypes.includes(type)) {
        return response.status(404).send("Invalid url!");
    }    
    try {
        const newItem = request.body;
        if (!newItem) {
            return response.send({ error: `Missing ${type} param` });
        }
        const items = request.data[type];
        const index = items.findIndex( e => newItem.id === e.id);

        if (index == -1) {
            return response.status(500).send(type + ' not found!');
        }

        // update the item with new properties
        items[index] = { ...items[index], ...newItem };
        saveData(items, type);

        return response.send(items[index]);
    } catch (error) {
        return response.status(500).send(error.message);
    }
});

app.delete("/:type/:id", (request, response) => {
    const type = request.params.type;
    if (!avalaibleTypes.includes(type)) {
        return response.status(404).send("Invalid url!");
    }    
    try {
        const items = request.data[type];
        const id = request.params.id;
        const index = items.findIndex( e => id === e.id);
        if (index == -1) {
            return response.status(500).send(error.message);
        }
        items.splice(index, 1);
        saveData(items, type);
        return response.send({success:true});
    } catch (error) {
      return response.status(500).send(error.message);
    }
});


app.post("/:type", async (request, response) => {
  const type = request.params.type;
  if (!avalaibleTypes.includes(type)) {
      return response.status(404).send("Invalid url!");
  }    
  try {
      const newItem = request.body;
      if (!newItem) {
          return response.send({ error: `Missing ${type} param` });
      }
      const items = request.data[type];
      newItem.id = uuidv4();
      if (type === "cards") {
          newItem.publishDate = '';
          newItem.category = request.data.categories[0].id || '';
      }
      items.push(newItem);

      await saveData(items, type);

      return response.send(newItem);
  } catch (error) {
      return response.status(500).send(error.message);
  }
});

app.listen.apply(app, [port, host]);
console.log(`Server started on: http://${host}:${port}\n`);

/*
const products = require("./Routers/products");
app.use("/products", products);
app.use("*", (req, res) => res.end());

app.listen.apply(app, [port, host]);
console.log(`Server started on: http://${host}:${port}\n`);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err.stack) {
    err = err.stack;
  }
  res.json(err);
});
*/