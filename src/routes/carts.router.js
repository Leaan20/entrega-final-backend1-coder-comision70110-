// Router de carts
import CartManager from "../dao/db/cart-manager-db.js";
import {Router} from "express";
const cartRouter = Router();


//instanciamos nuestro manager de carritos.
const manager = new CartManager();

// GET

// Ruta para ver un carrito específico con los productos que hay dentro
cartRouter.get('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const cart = await manager.getCartById(cid);

        if (!cart) {
            res.status(404).send(`No se encontró el carrito con id ${cid}`);
        } else {
            res.send(cart);
        }
    } catch (error) {
        res.send("Hubo un error al intentar cargar el carrito");
        console.log(error);
    }
});

// POST

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
    const newCart = await manager.createCart();
    if (!newCart) {
        res.status(500).send("Error al crear el carrito");
        return;
    }
    res.send(`El carrito se creó con la siguiente información: ${JSON.stringify(newCart)}`);
});

// POST

// Agregar un producto a un carrito específico
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const { quantity } = req.body;
    try {

        if (!cid || !pid) {
            res.status(400).send("El id del carrito y del producto son necesarios");
            return;
        }

        const add = await manager.addProductToCart(cid, pid, quantity);
        // Verificamos el valor y le damos la respuesta correspondiente.
        add ? res.send(`Se agregó el producto ${pid} al carrito ${cid} exitosamente! 😁`) : res.send(`No es posible agregar el producto ${pid} en el carrito ${cid} `);
        console.log(add);

    } catch (error) {
        res.send(`Hubo un error al intentar agregar un producto al carrito ${cid}`);
        console.log(error);
    }
});


export default cartRouter;