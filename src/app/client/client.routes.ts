import { Routes } from "@angular/router";
import { ClientAuthGuard } from "./core/guards/client-auth.guard";
import { ClientLayoutComponent } from "./layout/client-layout/client-layout.component";
import { ClientLoginComponent } from "./pages/auth/client-login/client-login.component";
import { ClientRegisterComponent } from "./pages/auth/client-register/client-register.component";
import { CartComponent } from "./pages/cart/cart/cart.component";
import { CheckoutComponent } from "./pages/checkout/checkout/checkout.component";
import { HomeComponent } from "./pages/home/home.component";
import { OrderDetailComponent } from "./pages/orders/order-detail/order-detail.component";
import { OrderListComponent } from "./pages/orders/order-list/order-list.component";
import { ProductDetailComponent } from "./pages/products/product-detail/product-detail.component";
import { ProductListComponent } from "./pages/products/product-list/product-list.component";

export const clientRoutes: Routes = [
  {
    path: "",
    component: ClientLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
        title: "E-Shop | Home",
      },
      {
        path: "products",
        component: ProductListComponent,
        title: "E-Shop | Products",
      },
      {
        path: "products/:id",
        component: ProductDetailComponent,
        title: "E-Shop | Product Details",
      },
      {
        path: "cart",
        component: CartComponent,
        title: "E-Shop | Cart",
      },
      {
        path: "checkout",
        component: CheckoutComponent,
        canActivate: [ClientAuthGuard],
        title: "E-Shop | Checkout",
      },
      {
        path: "orders",
        component: OrderListComponent,
        canActivate: [ClientAuthGuard],
        title: "E-Shop | My Orders",
      },
      {
        path: "orders/:id",
        component: OrderDetailComponent,
        canActivate: [ClientAuthGuard],
        title: "E-Shop | Order Details",
      },
    ],
  },
  {
    path: "login",
    component: ClientLoginComponent,
    title: "E-Shop | Sign In",
  },
  {
    path: "register",
    component: ClientRegisterComponent,
    title: "E-Shop | Sign Up",
  },
];
