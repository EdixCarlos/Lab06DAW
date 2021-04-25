const http = require("http");
const { bodyParser } = require("./libs/bodyParser");
const database = require("./persons.json");
async function createInfoHandler(req, res) {
  try {
    await bodyParser(req);
    database.push(req.body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(database));
    res.end();
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid Data");
    res.end();
  }
}
function getInfoHandler(req, res) {
  res.writeHead(200, { "Content-type": "text/html" });
  res.end(`<!doctype html><html><head><title>Lab06</title></head>
  <body><h1></h1><h2>Phonebook hast info for ${database.length} people</h2>
  <h2>${new Date()}</h2><//body></html>`);
}
async function updateInfoHandler(req, res) {
  try {
    let { url } = req;
    let idQuery = url.split("?")[1];
    let idKey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];
    if (idKey === "id") {
      await bodyParser(req);
      database[idValue - 1] = req.body;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(database));
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Invalid Request Query");
      res.end();
    }
  } catch (err) {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid body data was provided", err.message);
    response.end();
  }
}
async function deleteInfoHandler(req, res) {
  let { url } = req;
  let idQuery = url.split("?")[1];
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];

  if (idKey === "id") {
    database.splice(idValue - 1, 1);
    res.writeHead(200, { "Content-type": "text/plain" });
    res.write("Delete Success");
    res.end();
  } else {
    res.writeHead(400, { "Content-type": "text/plain" });
    res.write("Invalid Query");
    res.end();
  }
}
const server = http.createServer((req, res) => {
  const { url, method } = req;
  // Logger
  console.log(`URL: ${url} - Method: ${method}`);
  // Router
  switch (method) {
    case "GET":
      
      if (url === "/info") {
        getInfoHandler(req, res);
      }
      if (url === "/api/persons") { 
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(database));
        res.end();
      }
      break;
    case "POST":
      if (url === "/info") {
        createInfoHandler(req, res);
      }
      break;
    case "PUT":
      updateInfoHandler(req, res);
      break;
    case "DELETE":
      deleteInfoHandler(req, res);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found");
      res.end();
  }
});
server.listen(3000);
console.log("Server on port", 3000);
