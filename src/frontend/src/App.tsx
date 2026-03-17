import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";
import { Admin } from "./pages/Admin";
import { Cancel } from "./pages/Cancel";
import { ProductDetail } from "./pages/ProductDetail";
import { Storefront } from "./pages/Storefront";
import { Success } from "./pages/Success";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Storefront,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetail,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/success",
  component: Success,
});

const cancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cancel",
  component: Cancel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  adminRoute,
  successRoute,
  cancelRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
