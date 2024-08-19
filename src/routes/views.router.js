import {Router} from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const viewsRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager();



viewsRouter.get("/products", async (req,res) => {
    try {
        const products = await manager.getProducts();
        // Lo mapeamos para que pueda ser renderizado con Handlebars.
        const receivedProds = products.map(product=> ({
            _id : product._id,
            title: product.title,
            description : product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
           thumbnails :product.thumbnails
        }));
        console.log(receivedProds);
        
        if(products){
            return res.render("home", {products : receivedProds});
        } else {
            return res.send("No hay productos que mostrar")
        }
    } catch (error) {
        res.status(500).send("Hay un error del servidor");
        console.log(error);
    }
})

// Este router va a trabajar con websocket. para actualizar automaticamente la vista.

viewsRouter.get("/realtimeproducts", (req,res) => {
    try {
        return res.render("realTimeProducts");

    } catch (error) {
        res.status(500).send("Hay un error en el servidor, intente mas tarde");
    }
});






export default viewsRouter;