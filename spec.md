# Online Store

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Product catalog with categories and search
- Product detail pages with image, description, price
- Shopping cart (add/remove items, quantity updates)
- Checkout flow with Stripe payment integration
- Admin panel (login-protected) to manage products: add, edit, delete, upload images
- User authentication (Internet Identity) for admin access
- Blob storage for product images

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: product management (CRUD), cart/order logic, Stripe checkout session creation, admin role check
2. Frontend: storefront with hero, product grid, product detail, cart sidebar, checkout page
3. Frontend: admin dashboard with product management forms and image upload
4. Wire authorization for admin-only routes
5. Wire blob-storage for product image upload/display
6. Wire Stripe for payments
