import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../store/cartSlice';
import { useNotification } from '../context/NotificationContext';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { addNotification } = useNotification();

  const addItem = (product) => {
    dispatch(addToCart(product));
    addNotification(`Added ${product.name} to cart`, 'success');
  };

  const removeItem = (product) => {
    dispatch(removeFromCart(product));
  };

  const emptyCart = () => {
    dispatch(clearCart());
    addNotification('Cart has been cleared', 'info');
  };

  return {
    items,
    totalPrice,
    addItem,
    removeItem,
    emptyCart,
  };
};
