const express = require('express');
const fs = require('fs/promises');

const app = express();
const PORT = 8080;

app.use(express.json());

// rutas productos
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);
    const product = products.find((p) => p.id === req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    const newProduct = {
      id: generateProductId(),
      ...req.body,
    };

    products.push(newProduct);

    await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    const index = products.findIndex((p) => p.id === req.params.pid);

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...req.body,
        id: req.params.pid, // ID no actualizable
      };

      await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    const filteredProducts = products.filter((p) => p.id !== req.params.pid);

    await fs.writeFile('productos.json', JSON.stringify(filteredProducts, null, 2));
    res.send('Producto eliminado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// rutas cart
const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    let carts = JSON.parse(cartsData);

    const newCart = {
      id: generateCartId(),
      products: [],
    };

    carts.push(newCart);

    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find((c) => c.id === req.params.cid);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    let carts = JSON.parse(cartsData);

    const cartIndex = carts.findIndex((c) => c.id === req.params.cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex((p) => p.product === req.params.pid);

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        // nuevo producto al carrito
        carts[cartIndex].products.push({
          product: req.params.pid,
          quantity: 1,
        });
      }

      await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
      res.json(carts[cartIndex]);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function generateProductId() {
    const uniqueId = Math.floor(Math.random() * 1000000).toString();
    return uniqueId;
  }
  
  function generateCartId() {
    const uniqueId = Math.floor(Math.random() * 1000000).toString();
    return uniqueId;
  }