// Manager de carts MongoDB
import CartModel from "../models/cart.model.js";




class CartManager {

    // Creamos un nuevo carrito.
    async createCart(){
        try {
            // Creamos un nuevo carrito con un array de products vacio.
            const newCart = new CartModel({products: []});
            // lo guardamos con el metodo save.
            await newCart.save();
            return newCart;

        } catch (error) {
            console.log("Error al generar el carrito");
            return null;
            
        }
    }

    // Mostrar el carrito por id
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart){
                console.log("No existe el carrito con ese id");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al buscar el carrito por Id", error);
            
        }
    }

    //Agrega un producto al carrito
    // Si este ya existe actualiza su cantidad.
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
    
            // Convertir el productId a string para comparación
            const productExist = cart.products.find(item => item.product.toString() === productId);
    
            if (productExist) {
                // Aumentar la cantidad con el valor pasado en quantity
                productExist.quantity += quantity;
            } else {
                // Añadir el producto con la cantidad especificada
                cart.products.push({ product: productId, quantity });
            }
    
            // Marcar la propiedad "products" como modificada y luego guardarlo.
            cart.markModified("products");
            await cart.save();
            return cart;
    
        } catch (error) {
            console.log("No fue posible agregar un producto al carrito", error);
            throw error;
        }
    }

    // Eliminar carrito
    async deleteCart(cid){
        try {
            const cart = await CartModel.findByIdAndDelete(cid);
            if(!cart) {
                console.log("No existe el carrito que quiere eliminar");
                return;
            }
            console.log("Carrito eliminado exitosamente.");
            
        } catch (error) {
            console.log("No es posible eliminar el carrito seleccionado", error);
            
        }
    }

    
    // Eliminar un producto del carrito.
    async deleteCartProduct(cid, pid) {
        try {
            // Intenta encontrar el carrito y eliminar el producto por su ID
            const result = await CartModel.updateOne(
                { _id: cid, "products.product": pid }, // Coincide con el ID del carrito y el ID del producto dentro del carrito
                { $pull: { products: { product: pid } } } // Elimina el producto
            );
    
            if (result.matchedCount === 0) {
                console.log(`No se encontró el producto con el id: ${pid} en el carrito.`);
                return false; // Devuelve false si no se encontró el producto
            } else if (result.modifiedCount === 0) {
                console.log(`El producto con el id: ${pid} ya había sido eliminado del carrito.`);
                return false; // Devuelve false si el producto no fue eliminado (por ejemplo, ya había sido eliminado)
            } else {
                console.log("Producto eliminado exitosamente");
                return true; // Devuelve true si el producto fue eliminado con éxito
            }
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }
    
    

    
    // Vaciar el carrito
    async cleanCart(cid) {
        try {
            // Buscamos el carrito por Id
            const cart = await CartModel.findById(cid);
    
            if (!cart || cart.products.length === 0) {
                console.log("No hay productos en el carrito o no existe el carrito.");
                return null;
            }
    
            // Vaciamos el array de productos
            cart.products = [];
    
            // Guardamos los cambios en el carrito
            await cart.save();
    
            console.log("El carrito se vacio exitosamente.");
            return cart;  // Devuelve el carrito vacío
    
        } catch (error) {
            console.log("No es posible vaciar el carrito", error);
            throw error;  // Lanza el error para manejarlo en el router
        }
    }
    
    
    // Actualizar carrito.
    async updateCart(cid, update){

        if(!update){
            console.log("No hay datos a actualizar");
            return;
        }


        const cart = await CartModel.findByIdAndUpdate(cid,update);

        cart.save();

        console.log("Se ha actualizado el carrito exitosamente.");
        
    }

}


export default CartManager;