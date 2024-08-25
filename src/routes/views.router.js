import {Router} from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import ProductModel from "../dao/models/product.model.js";
const viewsRouter = Router();

//Instanciamos nuestro manager de productos.
const manager = new ProductManager();
const cartManager = new CartManager();


viewsRouter.get("/products", async (req,res) => {
    //Aplicamos las distintas querys, para poder dar un limite por pagina y poder ordenarlos segun la preferencia.
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'price';

    // Si no se aplica el orden descendente , aplicamos el ascendente por defecto.

    const order = req.query.order === 'desc' ? -1 : 1;
    const category = req.query.category || '';

    const filter = {};
    // si hay una categoria filtramos por esa categoria.
    if(category) {
        filter.category = category;
    }

    try {

        const options = {
            page,
            limit,
            sort: {sort : order},
            lean : true
        }
    // utilizamos el paginate de Mongoose, que recibe dos objetos , primero el filtro y luego las opciones.
    const products = await ProductModel.paginate(filter, options);

    res.render("home", {
        products: products.docs,
        pagination: {
            totalDocs: products.totalDocs,
            limit: products.limit,
            totalPages: products.totalPages,
            page: products.page,
            pagingCounter: products.pagingCounter,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage
        }
    });

    } catch (error) {
        res.status(500).send("Hay un error del servidor, no podemos mostrar los productos");
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
        // utilizamos el product(referenciado a cada elemento del array), en su array product. y sus distintas propiedades.
        const productInCart = cart.products.map(product => ({
            productId: product.product._id,
            quantity: product.quantity,
            title: product.product.title,
            price: product.product.price,
            category: product.product.category,
            thumbnails: product.product.thumbnails
        }));

        res.render("cartView", { cart: productInCart });

    } catch (error) {
        res.status(500).send("Hay un error , no es posible mostrar el carrito.");
        console.log(error);
    }
});

export default viewsRouter;