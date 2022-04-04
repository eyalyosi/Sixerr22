import { orderService } from '../../services/order.service'
import { socketService } from '../../services/socket.service';
// import { socketService, SOCKET_EVENT_ORDER_ADDED, SOCKET_EVENT_ORDER_ABOUT_YOU } from '../../services/socket.service.js'

export default {
    state: {
        orders: []
    },
    getters: {
        getOrders(state) {
            return state.orders
        },
    },
    mutations: {
        setOrders(state, { orders }) {
            state.orders = orders;
        },
        saveOrder(state, { order }) {
            const idx = state.orders.findIndex((currOrder) => currOrder._id === order._id)
            // console.log('save order inx', idx);
            if (idx !== -1) {
                // console.log('splice');
                state.orders.splice(idx, 1, order)
            } else {
                // console.log('push');
                state.orders.push(order)
            }
            console.log(state.orders);
        },
        removeOrder(state, { orderId }) {
            state.orders = state.orders.filter(order => order._id !== orderId)
        },
    },
    actions: {
        async addOrder({ state, commit }, { order }) {
            try {
                // console.log(order);
                const savedOrder = await orderService.save(order)
                // console.log('savedOrder', savedOrder);
                if (-1 === state.orders.findIndex((currOrder) =>
                    currOrder._id === savedOrder._id))
                    { socketService.emit('new order', savedOrder) }
                commit({ type: 'saveOrder', order: savedOrder })
            } catch {
                console.log('Cannot save order');
            }
        },
        async loadMyOrders({ commit, state }) {
            try {
                const orders = await orderService.getMyOrders()
                commit({ type: 'setOrders', orders })
            } catch (err) {
                console.log('Couldnt get user orders', err)
            }
        },
        removeOrder({ commit }, { orderId }) {
            orderService.removeOrder(orderId);
            commit({ type: 'removeOrder', orderId })
        },
        async approveOrder({ state, commit, dispatch }, { orderId }) {
            try {
                const { orders } = state
                const idx = orders.findIndex(order => order._id === orderId)
                // console.log('approved order idx', idx);
                if (idx !== -1) {
                    const updatedOrder = JSON.parse(JSON.stringify(orders[idx]))
                    updatedOrder.status = updatedOrder.status === 'approved' ? 'pending' : 'approved'
                    await dispatch({ type: 'addOrder', order: updatedOrder })
                    socketService.emit('order approved', updatedOrder)
                }

            } catch (err) {
                console.log(loggedinUser);
            }
        }
    }
}