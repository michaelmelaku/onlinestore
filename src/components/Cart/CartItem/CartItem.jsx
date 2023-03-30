import { Typography, Grid} from '@material-ui/core';
import {Remove, Add, Delete} from "@mui/icons-material";
import {useDispatch} from 'react-redux';
import useStyles from './styles';
import {removeItemFromCart, updateCartQuantity} from "../../../redux/reducers/cartSlice";

const CartItem = ({item}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  console.log(item.image);
  const onRemoveFromCart = (id) => {
      dispatch(removeItemFromCart(id))
  }

  const onUpdateCartQty = ({id, quantity}) => {
      dispatch(updateCartQuantity({id, quantity}))
  }

    return (
        <main className={classes.cartItemContainer}>
            <div className={classes.toolbar} />
            <Grid container justify="center" className={classes.cartItem} spacing={3}>
                <Grid item xs={4} sm={4} md={4} lg={4} className={classes.cartItemInfo}>
                    <div>
                        <img src={item.image} alt="cartImage" className={classes.cartItemImage}/>
                    </div>
                    <div>
                        <Typography className={classes.cartItemName}>{item.name}</Typography>
                        <Typography className={classes.cartItemPrice}>{`$${item.price}`}</Typography>
                    </div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} className={classes.cartItemActions}>
                    <Remove onClick={() => onUpdateCartQty({id: item.id,  quantity: -1})}/> 
                    <p className={classes.cartItemQuantity}>{item.quantity}</p>
                    <Add onClick={() => onUpdateCartQty({id: item.id,  quantity: 1})}/>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} className={classes.cartItemTotal}>
                    <p style={{marginTop: '2px'}}>{`$${item.totalPrice}`}</p>
                    <Delete onClick={() => onRemoveFromCart(item.id)} className={classes.removeCartButton}/>
                </Grid>
            </Grid>
        </main>
    )
}

export default CartItem;