import React, { useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { emptyCart } from '../../redux/reducers/cartSlice';
import { publicRequest } from '../../requestMethod';
import { resetStripeData} from "../../redux/reducers/stateSlices";
import HOC from "../HOC";

const OrderSuccess = ({userProfile, handleAppPage}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.states.stripeData);
    const cartItems = useSelector((state) => state.cart.cartItems);
    
    //const [orderId, setOrderId] = useState(null);
    let orderId = null;

    let total = 0;
    for(let i=0; i< cartItems.length; i++){
      total = total + cartItems[i]?.totalPrice;
  }
   
    useEffect(() => {
      const createOrder = async() => {
        try {
          const res = await publicRequest.post("/orders", {
              userId: userProfile?._id,
              orderItems: cartItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
            })),
            shippingAddress: {
              fullName: `${userProfile?.firstName} ${userProfile?.lastName}`,
              address: userProfile?.addressLine1,
              city: userProfile?.city,
              postalCode: userProfile?.zipCode,
              country: userProfile?.country
            },
            orderStatus: 'Pending',
            totalPrice: total,
          });
          orderId = res.data._id;
        } catch (error) {
          console.log(error);
        }
        
      };
      data && createOrder();
      dispatch(emptyCart());
      dispatch(resetStripeData());
      
    },[cartItems, data, userProfile, dispatch]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {orderId
        ? `Order has been created successfully. Your order number is ${orderId}`
        : `Successfull. Your order is being prepared...`}
      <button style={{ padding: 10, marginTop: 20 }} onClick={() => handleAppPage("productPage")} >Go to Homepage</button>
    </div>
  )
}

export default HOC(OrderSuccess)