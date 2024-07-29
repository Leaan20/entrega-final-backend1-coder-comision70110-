import express from "express";
import { urlencoded } from "express";
import { engine } from "express-handlebars";

const app = express();
const PORT = 8080;

// Routes
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

// Middleware
// Utilizaremos el formato Json.
app.use(express.json());
// para url complejas
app.use(urlencoded({extended:true}));
// Nuestros archivos estaticos
app.use(express.static("src/public"));
// Rutas
// Al utilizar estas rutas, evitamos repeticiones en el codigo de cada router.
app.use("/api/products", productRouter );
app.use("/api/carts", cartRouter);


// Handlebars , configuracion.
app.engine("handlebars", engine());

// Renderizar los archivos que tengan esa extension.
app.set("view engine", "handlebars");
// Donde se encuentran los archivos a renderizar.
app.set("views", "./src/views");



// Hacemos un lista de productos

const arrayProductos = [
    {nombre: "Fideos", descripcion: "los mas ricos", precio: 100},
    {nombre: "Arroz", descripcion: "Marolio", precio: 200},
    {nombre: "Aceite", descripcion: "Cocinero", precio: 10000}
];



app.get("/", (req,res) => {

    const user = {
        name : "Leandro",
        surName : "Fernandez",
        mayorEdad : false
    }
    // con render podemos renderizar el archivo que enviemos como parametro.
    res.render("index",{user, title : "El besto titulo"});
    // res.send("Pagina de inicio, bienvenido 😁👌");
});

app.get("/tienda", (req,res) => {
   res.render("tienda", {arrayProductos});
})

// Creamos nuestro servidor.
app.listen(PORT, () => {
    console.log(`servidor escuchando desde el puerto: http://localhost:${PORT}`);
});


