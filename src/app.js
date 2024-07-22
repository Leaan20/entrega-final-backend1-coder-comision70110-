import express from "express";
const app = express();
const PORT = 8080;

// Routes
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
// Middleware, utilizaremos el formato Json.
app.use(express.json());



// Rutas
app.use("/", productRouter );
app.use("/", cartRouter);

app.get("/", (req,res) => {
    res.send("Pagina de inicio 😁👌");
});


// Creamos nuestro servidor.
app.listen(PORT, () => {
    console.log(`servidor escuchando desde el puerto: http://localhost:${PORT}`);
});


