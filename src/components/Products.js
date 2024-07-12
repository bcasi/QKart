import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cart, setCart] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /* @property {string} productId - Unique ID for the product
   */

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  useEffect(() => {
    setIsLoading(true);

    performAPICall().then((prodResp) => {
      setProducts(prodResp);
      if (token) {
        fetchCart(token).then((cartResp) => {
          setCart(generateCartItemsFrom(cartResp, prodResp));
        });
      }

      setIsLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const performAPICall = async () => {
    let message;
    const url = config.endpoint + "/products";
    try {
      const fetchProducts = await axios.get(url);
      const resp = await fetchProducts.data;
      return resp;
    } catch (err) {
      if (err.response) {
        message = err.response.data.message;
        snackbarCall(message, "error");
      } else {
        message =
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";

        snackbarCall(message, "error");
      }
      return;
    }
  };

  function snackbarCall(message, type) {
    const variant = { variant: type };
    enqueueSnackbar(message, variant);
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setIsLoading(true);
    let url = config.endpoint + "/products/search";
    if (text !== "") {
      url = `${url}?value=${text}`;
    }
    try {
      const searchProducts = await axios.get(url);
      const resp = await searchProducts.data;
      setIsLoading(false);
      setProducts(resp);
      return;
    } catch (err) {
      setIsLoading(false);
      let message;
      if (err.response) {
        setProducts(err.response.data);
      } else {
        message =
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";

        snackbarCall(message, "error");
      }
      return;
    }
  };

  useEffect(() => {
    let newTimeout;
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    if (search !== "") {
      newTimeout = setTimeout(() => performSearch(search), 1000);
      setDebounceTimeout(newTimeout);
    } else {
      performAPICall().then((resp) => {
        setProducts(resp);
        setIsLoading(false);
      });
    }
  }, [search]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {};

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const getCart = await axios.get(config.endpoint + "/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await getCart.data;
      return resp;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let result = false;
    const isItem = items.find((item) => item.productId === productId);
    if (isItem) {
      result = true;
    }
    return result;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (options.preventDuplicate) {
      const isItem = isItemInCart(items, productId);

      if (isItem) {
        return enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      }
    }

    const url = config.endpoint + "/cart";

    try {
      const addProductsInCart = await axios.post(
        url,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newCart = await addProductsInCart.data;

      setCart(generateCartItemsFrom(newCart, products));
    } catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message, {
          variant: "warning",
        });
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          placeholder="Search for items/categories"
          size="large"
          fullWidth
          value={search}
          onChange={(e) => {
            handleSearch(e);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => {
          handleSearch(e);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container className="product-grid-container" spacing={2}>
        <Grid
          item
          xs={username ? 12 : ""}
          md={username ? 8 : ""}
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {!isLoading ? (
            <Grid container spacing={2} className="products-grid2">
              {products?.length && products?.length > 0 ? (
                products?.map((product) => {
                  return (
                    <Grid item xs={6} md={3} key={product._id}>
                      <ProductCard
                        product={product}
                        handleAddToCart={() => {
                          addToCart(token, cart, products, product._id, 1, {
                            preventDuplicate: true,
                          });
                        }}
                      />
                    </Grid>
                  );
                })
              ) : (
                <div className="loading">
                  <SentimentDissatisfied />
                  <p>No products found</p>
                </div>
              )}
            </Grid>
          ) : (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <div className="loading">
                  <CircularProgress />
                </div>

                <Typography>Loading Products....</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
        <Grid item className="cart-grid">
          {username && (
            <Cart products={products} items={cart} handleQuantity={addToCart} />
          )}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
