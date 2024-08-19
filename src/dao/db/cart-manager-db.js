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
            console.log("Error al buscar el carrito por Id");
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
    
            // Convertir el productId a string para comparar.
            const productExist = cart.products.find(item => item.product.toString() === productId);
    
            if (productExist) {
                // Aumentar la cantidad con el valor pasado en quantity.
                productExist.quantity += quantity;
            } else {
                // Añadir el producto con la cantidad especificada.
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
    async DeleteCart(id){
 
    }

    // Actualizar carrito.
    async UpdateCart(){

    }

}


export default CartManager;