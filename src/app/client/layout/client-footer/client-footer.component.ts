import { Component } from "@angular/core";

@Component({
  selector: "app-client-footer",
  imports: [],
  template: `
    <footer
      class="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <span class="text-xl font-bold text-brand-500">
              <i class="fa-solid fa-store"></i> E-Shop
            </span>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your one-stop destination for quality products at great prices.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4
              class="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3"
            >
              Quick Links
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="/shop/products"
                  class="text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  ><i class="fa-solid fa-angle-right mr-1"></i> All Products</a
                >
              </li>
              <li>
                <a
                  href="/shop/cart"
                  class="text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  ><i class="fa-solid fa-angle-right mr-1"></i> Shopping Cart</a
                >
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4
              class="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3"
            >
              Contact
            </h4>
            <ul class="space-y-2">
              <li class="text-sm text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-envelope mr-2"></i> support&#64;eshop.com
              </li>
              <li class="text-sm text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-phone mr-2"></i> +1 234 567 890
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <p class="text-sm text-gray-400 dark:text-gray-500">
            &copy; {{ currentYear }} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: ``,
})
export class ClientFooterComponent {
  currentYear = new Date().getFullYear();
}
