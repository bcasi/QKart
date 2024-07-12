import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import { makeStyles } from "@mui/styles";
import React from "react";
import "./ProductCard.css";

const useStyles = makeStyles((theme) => ({
  logoutButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
    },
  },
}));

const ProductCard = ({ product, handleAddToCart }) => {
  const classes = useStyles();

  const { image, name, cost, category, rating, _id } = product;
  return (
    <Card className="card">
      <CardMedia sx={{ height: 140 }} image={image} title={name} />
      <CardContent className="card-content">
        <Typography
          className="card-content"
          gutterBottom
          variant="h5"
          component="div"
        >
          {name}
        </Typography>
        <Typography
          className="card-content"
          variant="body2"
          color="text.contrastText"
        >
          <strong>${cost}</strong>
        </Typography>
        <Rating name="read-only" value={rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button">ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
