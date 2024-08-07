import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cartItems = cartData.map((cart) => {
    let data = productsData.find((product) => product._id === cart.productId);
    const { name, category, cost, rating, image } = data;
    let result = { ...cart, name, category, cost, rating, image };
    return result;
  });

  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalValue = 0;
  items.forEach((cartItem) => {
    let totalCostOfQty = cartItem.cost * cartItem.qty;
    totalValue += totalCostOfQty;
  });
  return totalValue;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ isReadOnly, value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly && (
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
      )}
      <Box padding="0.5rem" data-testid="item-qty">
        {!isReadOnly ? value : `Qty: ${value}`}
      </Box>
      {!isReadOnly && (
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      )}
    </Stack>
  );
};

const getTotalItems = (items) => {
  let result = 0;
  items.forEach((item) => {
    result += item.qty;
  });

  return result;
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items?.map((cartItem) => {
          return (
            <Box
              key={cartItem.name}
              display="flex"
              alignItems="flex-start"
              padding="1rem"
            >
              <Box className="image-container">
                <img
                  // Add product image
                  src={cartItem.image}
                  // Add product name as alt eext
                  alt={cartItem.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{cartItem.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <ItemQuantity
                    isReadOnly={isReadOnly}
                    value={cartItem.qty}
                    handleAdd={() => {
                      handleQuantity(
                        token,
                        items,
                        products,
                        cartItem.productId,
                        cartItem.qty + 1
                      );
                    }}
                    handleDelete={() => {
                      handleQuantity(
                        token,
                        items,
                        products,
                        cartItem.productId,
                        cartItem.qty - 1
                      );
                    }}
                    // Add required props by checking implementation
                  />
                  <Box padding="0.5rem" fontWeight="700">
                    ${cartItem.qty * cartItem.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart">
          <Box
            display="flex"
            alignItems=""
            justifyContent="space-evenly"
            flexDirection="column"
            className="order-details"
          >
            <h3>Order Details</h3>
            <Box display="flex" justifyContent="space-between">
              <p>Products</p>
              <p> {getTotalItems(items)}</p>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <p>Subtotal</p>
              <p>${getTotalCartValue(items)}</p>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <p>Shipping Charges</p>
              <p>$0</p>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <p className="bold">Total</p>
              <p className="bold"> ${getTotalCartValue(items)}</p>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
