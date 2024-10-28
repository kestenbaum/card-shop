import {createContext, useReducer} from "react";
import {DUMMY_PRODUCTS} from "../dummy-products.js";

export const CartContext = createContext({
    items: [],
    addItemsToCart: () => {},
    updateItemsToCart: () => {},
})

function cartReducer(state, action) {
    if (action.type === "ADD_TO_CART") {
            const updatedItems = [...state.items];

            const existingCartItemIndex = updatedItems.findIndex(
                (cartItem) => cartItem.id === action.payload
            );
            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                updatedItems[existingCartItemIndex] = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                };
            } else {
                const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
                updatedItems.push({
                    id: action.payload,
                    name: product.title,
                    price: product.price,
                    quantity: 1,
                });
            }

            return {
                items: updatedItems,
            };
    }

    if (action.type === "UPDATE_CART") {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }
    return state;
}


export default function CartContextProvider ({children}) {
    const [carts, dispatch] = useReducer(cartReducer, {
        items: [],
    });

    function handleAddItemToCart(id) {
       dispatch({
           type: "ADD_TO_CART",
           payload: id
       })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
       dispatch({
           type: "UPDATE_CART",
           payload: {
               productId,
               amount
           }
       })
    }

    const value = {
        items: shoppingCart.items,
        addItemsToCart: handleAddItemToCart,
        updateItems: handleUpdateCartItemQuantity,
    };

    return <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider>
}