import { create } from 'zustand';
import Cookie from 'js-cookie';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,

    setAuth: (user, token) => {
        Cookie.set('user', JSON.stringify(user));
        Cookie.set('token', token);
        set({ user, token });
    },

    logout: () => {
        Cookie.remove('user');
        Cookie.remove('token');
        set({ user: null, token: null });
    },

    restoreAuth: () => {
        const user = Cookie.get('user');
        const token = Cookie.get('token');
        if (user && token) {
            set({ user: JSON.parse(user), token });
        }
    },
}));

export const useCartStore = create((set, get) => ({
    items: [],

    addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.product._id === product._id);

        if (existingItem) {
            set({
                items: items.map(item =>
                    item.product._id === product._id ?
                    {...item, quantity: item.quantity + 1 } :
                    item
                ),
            });
        } else {
            set({
                items: [...items, { product, quantity: 1 }],
            });
        }
    },

    removeItem: (productId) => {
        set({
            items: get().items.filter(item => item.product._id !== productId),
        });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        set({
            items: get().items.map(item =>
                item.product._id === productId ?
                {...item, quantity } :
                item
            ),
        });
    },

    clearCart: () => {
        set({ items: [] });
    },

    getTotalPrice: () => {
        return get().items.reduce((total, item) => {
            const price = item.product.price * (1 - (item.product.discount || 0) / 100);
            return total + price * item.quantity;
        }, 0);
    },

    getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },
}));