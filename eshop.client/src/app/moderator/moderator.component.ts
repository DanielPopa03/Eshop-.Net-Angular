import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../models/category/category';
import { AuthService } from '../../services/auth-service/auth.service';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Supplier } from '../../models/supplier/supplier';
import { Product } from '../../models/product/product';

@Component({
  selector: 'app-moderator',
  standalone: false,
  templateUrl: './moderator.component.html',
  styleUrl: './moderator.component.css'
})
export class ModeratorComponent implements OnInit {
  products: any[] = [];
  suppliers: Supplier[] = [];
  showAddModal = false;
  previewImages: string[] = [];
  previewImagesAtTheStart: string[] = [];
  selectedCompanyId: number = 0;
  categories: Category[] = [];
  isEditMode = false;

  newProduct: {
    id: number | null;
    name: string;
    description: string;
    categoryId: number | null;
    imageFiles: File[];
    price: number | null;
    stock: number | null;
  } = {
      id: null,
      name: '',
      description: '',
      categoryId: null,
      imageFiles: [],
      price: null,
      stock: null
   };

  page = 1;
  size = 5;
  totalPages = 1;
  constructor(private authService: AuthService, private productService: ProductService,
    private supplierService: SupplierService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    if (this.authService.roleOfUser() === 'Moderator') {
      this.supplierService.getUserSuppliers().subscribe(companies => {
        this.suppliers = companies
        this.selectedCompanyId = this.suppliers[0].id;
        this.fetchProducts();
      });
    }
    if (this.authService.roleOfUser() === 'Admin') {
      this.supplierService.getAllSuppliers().subscribe(companies => {
        this.suppliers = companies
        this.selectedCompanyId = this.suppliers[0].id;
        this.fetchProducts();
      });
    }
  }

  fetchProducts(): void {
    this.productService.getPagedProductsOfSupplier(this.selectedCompanyId,
      this.page, this.size).subscribe((res: { items: any[]; totalPages: number; }) => {
      this.products = res.items;
        this.totalPages = res.totalPages;
        console.log(res)
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      if (!this.isEditMode)
      this.newProduct.categoryId = this.categories[0].categoryId;
    })
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchProducts();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchProducts();
    }
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    this.newProduct.imageFiles.splice(index, 1);
  }

  editProduct(product: any): void {
    this.newProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      imageFiles: [],
      price: parseFloat(product.price),
      stock: product.stock
    };

    this.previewImages = product.images.map((image: any) => 'https://localhost:7060' + image.imageUrl);
    this.previewImagesAtTheStart = [...this.previewImages];
    this.isEditMode = true;
    this.showAddModal = true;
    this.fetchCategories();
  }


  removeProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.fetchProducts());
    }
  }

  selectCompany(): void {
    console.log('Open company selector or dropdown');
    // Open modal, dropdown, or route to a page
  }

  onCompanyChange(): void {
    console.log('Selected Company ID:', this.selectedCompanyId);
    this.page = 1;
    this.fetchProducts(); // optionally refetch data based on selected company
  }

  addProduct(): void {
    this.showAddModal = true;
    this.fetchCategories();
  }

  cancelAddProduct(): void {
    this.showAddModal = false;
    this.previewImages = [];
    this.previewImagesAtTheStart = [];
    this.isEditMode = false;
    this.newProduct = {
      id: null,
      name: '',
      description: '',
      categoryId: null,
      imageFiles: [],
      price: null,
      stock: null
    };
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length) {
      this.newProduct.imageFiles = files;
      this.previewImages.push(...files.map(file => URL.createObjectURL(file)));
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.onFileSelect({ target: { files: event.dataTransfer.files } });
    }
  }

  onDragOver(event: Event): void {
    event.preventDefault();
  }

  submitProduct(): void {
    const payload: Product = {
      id: this.newProduct.id!,
      name: this.newProduct.name,
      description: this.newProduct.description,
      categoryId: this.newProduct.categoryId!,
      supplierId: this.selectedCompanyId,
      price: this.newProduct.price!,
      stock: this.newProduct.stock!
    };

    const request$ = this.isEditMode
      ? this.productService.updateProduct(payload, this.newProduct.imageFiles,
        this.previewImagesAtTheStart
          .filter(img => !this.previewImages.includes(img))
          .map(img => img.replace('https://localhost:7060', '')))
      : this.productService.addProduct(payload, this.newProduct.imageFiles);

    request$.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Product updated' : 'Product added');
        this.cancelAddProduct();
        this.fetchProducts();
      },
      error: err => {
        console.error('Operation failed', err);
      }
    });
  }
}
