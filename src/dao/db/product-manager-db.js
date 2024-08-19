// Manager de productos con mongoose

import ProductModel from "../models/product.model.js";



class ProductManager {


    // Crear y agregar un producto nuevo.

    async addProduct({title,description, code, price, status= true, stock, category, thumbnails }){

        try {
        // Validaciones
        // Completar datos del producto.
    if(!title || !description || !code || !price || !stock || !category) {
        console.log('Es necesario completar todos los campos');
        return;
    }

    const productExist = await ProductModel.findOne({code : code});

    if(productExist) {
        console.log("El codigo debe ser unico");
        return;
    }


    // Creamos el producto a partir del model.

    const newProduct = new ProductModel({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    } );

    // Guardamos el producto en la DB
    await newProduct.save();

    } catch(error){
        console.log("Error al agregar un productor", error);
        return null;
    }
}


    // Metodo para obtener la lista de productos total

    async getProducts(){
        try {
            const productsArray = await ProductModel.find();
            return productsArray;
        } catch (error) {
            console.log("Error al obtener los productos" , error);
        }
    }

    // Metodo para obtener un producto por id

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if(!product){
                console.log("El producto no fue encontrado.");
                return null;
            }

            console.log("Producto encontrado!");
            return product;
        } catch (error) {
            console.log("Error al buscar el producto por id", error);
        }
    }

    // Actualizar informacion de un producto.

    async updateProduct(id, updateProduct){
        try {
            const update = await ProductModel.findByIdAndUpdate(id, updateProduct);

            if(!update){
                console.log("No se encuentra el producto, intente nuevamente");
                return null;
            }

            return update;

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    // Eliminar un producto

    async deleteProduct(id){
        try {
            const productDelete = await ProductModel.findByIdAndDelete(id);

            if(!productDelete){
                console.log("No existe el producto que desea eliminar, vuelva a intentar. ");
                return;
            }
            console.log("Producto eliminado exitosamente.");
            
        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }


}


export default ProductManager;