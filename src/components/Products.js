import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { productCardData } from "../helpers/sample";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
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

    performAPICall().then((resp) => {
      setProducts(resp);
      setIsLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    if (e.target.value !== "") setSearch(e.target.value);
  };

  const performAPICall = async () => {
    let message;
    const url = config.endpoint + "/products";
    console.log(url);
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
    console.log("c");
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
    if (search !== "") {
      if (debounceTimeout !== 0) {
        clearTimeout(debounceTimeout);
      }
      const newTimeout = setTimeout(() => performSearch(search), 1000);
      setDebounceTimeout(newTimeout);
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
  const debounce = (func, debounceTimer = 1000) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, debounceTimer);
    };
  };

  const debounceSearch = debounce(performSearch, 2000);

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
      <Grid container spacing={2}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      {!isLoading ? (
        <Grid container spacing={2} className="products-grid2">
          {products?.length && products?.length > 0 ? (
            products?.map((product) => {
              return (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              );
            })
          ) : (
            <div className="loading">
              😑
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

      <Footer />
    </div>
  );
};

export default Products;
