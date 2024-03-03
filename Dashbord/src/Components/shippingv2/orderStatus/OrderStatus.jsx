import React from 'react'
import CloseIcon from './orderIcons/icons8-close.gif';
import DeliveryIcon from './orderIcons/icons8-delivered-box.gif';
import OrderDone from './orderIcons/icons8-done (1).gif';
import OrderCreated from './orderIcons/icons8-done.gif';
import OrderOnHold from './orderIcons/icons8-hold-60.png';
import orderReturned from './orderIcons/icons8-package-returned-64.png';
import orderPending from './orderIcons/icons8-pending.gif';
import orderPickup from './orderIcons/icons8-pickup.gif';
import ShippingPending from './orderIcons/icons8-shipping.gif';
import { Stack, Typography } from '@mui/material';
import { OrderDetails } from './OrderDetails';

export const salahCustomization = {
  initiated: { en: "initiated", ar: "بدأ الطلب" },
  created: { en: "created", ar: "تم الطلب" },
  pending: { en: "pending", ar: "طلب معلق" },
  awaiting_pickup: { en: "awaiting pick up", ar: "في انتظار  اخذ الطلب" },
  currently_shipping: { en: "currently shipping", ar: "في الطريق للتوصيل" },
  shipment_on_hold: { en: "shipment on hold", ar: "الشحن معلق" },
  delivered: { en: "delivered", ar: "تم التوصيل" },
  canceled: { en: "canceled", ar: "  الطلب مرفوض" },
  returned: { en: "returned", ar: "طلب مرتجع" },
}

export const ReturnedIcon = ({ status, lng }) => {
  console.log(status, 'statusstatusstatusstatus')

  if(status==="pending"){
    console.log(status,'status')

    return <OrderDetails Icon={OrderCreated} lng={lng} status={status} />;

  }
  switch (status) {
    case "initiated":
      return <OrderDetails Icon={OrderCreated} lng={lng} status={status} />;
    case "created":
      return <OrderDetails Icon={OrderCreated} lng={lng} status={status} />;
    case "pending":
      return <OrderDetails Icon={orderPending} lng={lng} status={status} />;
    case "awaiting_pickup":
      return <OrderDetails Icon={orderPickup} lng={lng} status={status} />;
    case "currently_shipping":
      return <OrderDetails Icon={DeliveryIcon} lng={lng} status={status} />;
    case "shipment_on_hold":
      return <OrderDetails Icon={OrderOnHold} lng={lng} status={status} />;
    case "canceled":
      return <OrderDetails Icon={CloseIcon} lng={lng} status={status} />;
    case "delivered":
      return <OrderDetails Icon={OrderDone} lng={lng} status={status} />;
    case "returned":
      return <OrderDetails Icon={orderReturned} lng={lng} status={status} />;
    default:
      return null; // Or some default component if none of the cases match
  }
}
export default function OrderStatus({ status, lng }) {

 
  return (

    <>
      <ReturnedIcon status={status} lng={lng} />


    </>
  )
}
