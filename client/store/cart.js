import axios from 'axios'

//Action Types
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'
const GET_CART = 'GET_CART'

//Initial State
const defaultCart = []

//Action Creators
export const addItem = (ingredientId, quantity) => (
    {
        type: ADD_ITEM,
        cartItem: { ingredientId, quantity }
    }
);

export const updateItem = (ingredientId, quantity) => (
    {
        type: UPDATE_ITEM,
        cartItem: { ingredientId, quantity }
    }
);

export const removeItem = ingredientId => ({ type: REMOVE_ITEM, ingredientId });

export const getCart = cart => ({ type: GET_CART, cart })

// Thunks

export const fetchSessionCart = () =>
    dispatch =>
        axios.get('/cart')
            .then(res => dispatch(getCart(res.data)))
            .catch(err => console.log(err))

export const addToSessionCart = (ingredientId, quantity) =>
    dispatch =>
        axios.post('/cart', { ingredientId, quantity })
            .catch(err => console.log(err))

export const updateSessionCart = (ingredientId, quantity) =>
    dispatch =>
        axios.put('/cart', { ingredientId, quantity })
            .catch(err => console.log(err))

export const deleteSessionItem = (ingredientId) =>
    dispatch =>
        axios.delete(`/cart/${ingredientId}`)
            .catch(err => console.log(err))

//Reducer
export default function (state = defaultCart, action) {
    switch (action.type) {
        case ADD_ITEM:
            const foundItem = state.find(onCartItem => onCartItem.ingredientId === action.cartItem.ingredientId)
            if (foundItem) return onCartQuantityAdd(state, action);
            else return [...state, action.cartItem];

        case REMOVE_ITEM:
            return state.filter(onCartItem => onCartItem.ingredientId !== action.ingredientId)

        case UPDATE_ITEM:
            return onCartQuantityUpdate(state, action);

        case GET_CART:
            return action.cart;

        default:
            return state
    }
}

//Reducer helper functions
const onCartQuantityAdd = (state, action) => {
    return state.map(onCartItem => {
        if (onCartItem.ingredientId === action.cartItem.ingredientId) {
            action.cartItem.quantity += onCartItem.quantity;
            return action.cartItem;
        } else return onCartItem;
    })
}

const onCartQuantityUpdate = (state, action) => {
    return state.map(onCartItem => {
        if (onCartItem.ingredientId === action.cartItem.ingredientId) {
            return action.cartItem;
        } else return onCartItem;
    })
}








