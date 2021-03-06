import React, { useEffect } from 'react'

import { Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { createOrder } from '../store/actions/orderActions'

import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'

const PlaceOrderScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)

  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.itemsPrice = addDecimal(
    cart.cartItems.reduce((acc, item) => {
      return acc + item.price * item.qty
    }, 0)
  )

  cart.shippingPrice = addDecimal(cart.itemsPrice > 10 ? 2 : 10)

  cart.taxPrice = addDecimal(Number((0.35 * cart.itemsPrice).toFixed(2)))

  cart.totalPrice = addDecimal(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  )
  const dispatch = useDispatch()
  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      console.log(order)
      // history.push(`/order/${order._id}`)
      history.push(`/profile`)
    }
    // eslin-disabled-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    console.log(cart)
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <span>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method: </h2>
              <span>
                <strong>Payment Method: </strong>
                {cart.paymentMethod}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <span>
                <strong>Cart Items:</strong>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty.</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, idx) => {
                      return (
                        <ListGroup.Item key={idx}>
                          <Row>
                            <Col lg={1} md={2} sm={3}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              ></Image>
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x $ {item.price} ={'$ '}
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                )}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summery</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>$ {cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>$ {cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$ {cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>$ {cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
