import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import {
  AdminProduct,
  AdminProductService,
} from "../../../shared/services/product/admin-product.service";
import { AddProductDialogComponent } from "../add-product-dialog/add-product-dialog.component";
import { DeleteProductDialogComponent } from "../delete-product-dialog/delete-product-dialog.component";
import { EditProductDialogComponent } from "../edit-product-dialog/edit-product-dialog.component";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    AddProductDialogComponent,
    EditProductDialogComponent,
    DeleteProductDialogComponent,
  ],
  templateUrl: "./products.component.html",
})
export class ProductsComponent implements OnInit {
  products: AdminProduct[] = [];
  loading = true;
  error = "";

  // Dialog states
  addDialogOpen = false;
  editDialogOpen = false;
  deleteDialogOpen = false;

  selectedProduct: AdminProduct | null = null;

  constructor(private productService: AdminProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load products", err);
        this.error = err?.error?.message || "Failed to load products";
        this.loading = false;
      },
    });
  }

  // Add Product
  openAddDialog(): void {
    this.addDialogOpen = true;
  }

  closeAddDialog(): void {
    this.addDialogOpen = false;
  }

  onProductAdded(): void {
    this.addDialogOpen = false;
    this.loadProducts();
  }

  // Edit Product
  openEditDialog(product: AdminProduct): void {
    this.selectedProduct = product;
    this.editDialogOpen = true;
  }

  closeEditDialog(): void {
    this.editDialogOpen = false;
    this.selectedProduct = null;
  }

  onProductEdited(): void {
    this.editDialogOpen = false;
    this.selectedProduct = null;
    this.loadProducts();
  }

  // Delete Product
  openDeleteDialog(product: AdminProduct): void {
    this.selectedProduct = product;
    this.deleteDialogOpen = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen = false;
    this.selectedProduct = null;
  }

  onProductDeleted(): void {
    this.deleteDialogOpen = false;
    this.selectedProduct = null;
    this.loadProducts();
  }
}
