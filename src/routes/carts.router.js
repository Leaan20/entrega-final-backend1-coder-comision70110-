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
        res.status(500).send("Hubo un error al intentar cargar el carrito");
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

// DELETE

// Eliminar un producto del carrito.
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const deleteProduct = await manager.deleteCartProduct(cid, pid);

        if (!deleteProduct) {
            return res.status(404).send(`No se encontró o ya había sido eliminado el producto con el id: ${pid}.`);
        }
        return res.status(200).send("Se eliminó el producto correctamente.");
    } catch (error) {

        return res.status(500).send("Error en el servidor, no fue posible eliminar el producto.");
    }
});

// Eliminar todos los productos del carrito (vaciar)
cartRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cleanedCart = await manager.cleanCart(cid);

        if (!cleanedCart) {
            res.status(404).send("No se encontró el carrito o ya estaba vacío.");
            return;
        }

        res.status(200).send("Vaciaste el carrito exitosamente.");
        
    } catch (error) {
        console.log("Hubo un error al vaciar el carrito", error);
        res.status(500).send("No fue posible vaciar el carrito, prueba nuevamente más tarde.");
    }
});

// PUT

// Actualizar el carrito con un arreglo de productos.
// Recibira el arreglo con los productos (que tenemos cargados en nuestra coleccion de products).
// el formato sera con product(con el Id que nos da MongoDB) y su cantidad (quantity), luego el resto de la informacion sera accesible o visible a partir del populate en nuestro manager.
cartRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const update = req.body;

        if (!cid) {
            return res.status(404).send("El carrito solicitado no existe");
        }

        if (!update || update.length === 0) {
            return res.status(404).send("No hay productos para actualizar.");
        }

        const updateCart = await manager.updateCart(cid, update);
        console.log(updateCart);
        res.status(201).send("Se ha actualizado el carrito con los productos recibidos.");

    } catch (error) {
        res.status(500).send("Tenemos un error, no podemos actualizar el carrito en este momento.");
        console.log(error);
    }
});



// Actualiza solo la cantidad del mismo producto.

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let { quantity } = req.body;
    try {
        //Validacion de la cantidad, para el caso que no sea un numero, no haya informacion o sea un numero negativo.
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            quantity = 1;
        }
        
        // Actualizamos la cantidad del producto en el carrito, reutilizamos el metodo, que si existe el producto solo actualiza la cantidad.
        const update = await manager.addProductToCart(cid, pid, quantity);

        console.log("Se pudo actualizar la cantidad de productos.");

        // Enviamos la respuesta con el carrito actualizado
        res.status(200).json({
            message: "Se actualizó la cantidad agregada.",
            cart: update
        });

    } catch (error) {
        console.log("No es posible actualizar el carrito", error);
        res.status(500).send("Hubo un problema al actualizar el carrito, intente más tarde.");
    }
});


export default cartRouter;