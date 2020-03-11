import Invoice from "../pages/invoice/invoice";
import InvoiceItem from "../pages/invoice/invoiceItem/invoiceItem";
import Credit from "../pages/credit/credit";
import PaymentItem from "../pages/credit/paymentItem/paymentItem";
import BaseBalanceInvoice from "../pages/base-balance/baseBalanceInvoice";
import BaseBalanceInvoiceItem from '../pages/base-balance/baseBalanceInvoiceItem/baseBalanceInvoiceItem'
import NotFound from "../pages/notFound";
import Chart from '../components/chart/chart';

const routes = [
  {
    //invoice page
    name: "Invoices",
    path: "/invoice",
    component: Invoice,
    icon: "file",
    meta: {
      child: false
    }
  },
  {
    //invoice detail page/invoiceId
    name: "Invoice Item",
    path: "/invoices/:id",
    component: InvoiceItem,
    icon: "file",
    meta: {
      child: true
    }
  },
  {
    //base balance invoice page
    name: "Base Balance Invoice",
    path: "/base-balance-invoice",
    component: BaseBalanceInvoice,
    icon: "file",
    meta: {
      child: false
    }
  },
  {
    //base balance invoice page
    name: "Base Balance Invoice Item",
    path: "/base-balance-invoices/:id",
    component: BaseBalanceInvoiceItem,
    icon: "file",
    meta: {
      child: true
    }
  },
  {
    //credit page
    name: "Payments",
    path: "/credit",
    component: Credit,
    icon: "file",
    meta: {
      child: false
    }
  },
  {
    //credit page
    name: "Payment",
    path: "/payments/:id",
    component: PaymentItem,
    icon: "file",
    meta: {
      child: true
    }
  },
  {
    //credit page
    name: "chart",
    path: "/chart",
    component: Chart,
    icon: "file",
    meta: {
      child: false
    }
  },

];
export default routes;
