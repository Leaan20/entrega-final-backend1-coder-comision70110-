import {Router} from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
const viewsRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager();
const cartManager = new CartManager();


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
            thumbnails: product.thumbnails
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


// Vista para el carrito.

viewsRouter.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            res.send(`No hay un carrito con el id ${cid}`);
            return;
        }

        const productInCart = cart.products.map(product => ({
            productId: product.product._id,
            quantity: product.quantity,
        }));

        res.render("cartView", { cart: productInCart });

    } catch (error) {
        res.status(500).send("Hay un error , no es posible mostrar el carrito.");
        console.log(error);
    }
});

export default viewsRouter;