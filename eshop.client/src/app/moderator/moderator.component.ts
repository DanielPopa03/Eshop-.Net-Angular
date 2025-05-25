import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../models/category/category';
import { AuthService } from '../../services/auth-service/auth.service';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Supplier } from '../../models/supplier/supplier';

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
  previewImage: string | null = null;
  selectedCompanyId: number = 0;
  categories: Category[] = [];

  newProduct: {
    name: string;
    description: string;
    categoryId: number | null;
    imageFile: File | null;
  } = {
      name: '',
      description: '',
      categoryId: null,
      imageFile: null
   };

  page = 1;
  size = 5;
  totalPages = 1;
  constructor(private authService: AuthService,
    private supplierService: SupplierService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchSuppliers();
    this.fetchProducts();
  }

  fetchSuppliers(): void {
    if (this.authService.roleOfUser() === 'Moderator') {
      this.supplierService.getUserSuppliers().subscribe(companies => {
        this.suppliers = companies
        this.selectedCompanyId = this.suppliers[0].id;
      });
    }
    if (this.authService.roleOfUser() === 'Admin') {
      this.supplierService.getAllSuppliers().subscribe(companies => {
        this.suppliers = companies
        this.selectedCompanyId = this.suppliers[0].id;
      });
    }
  }

  fetchProducts(): void {
    //this.productService.getPagedProducts(this.page, this.size).subscribe(res => {
    //  this.products = res.items;
    //  this.totalPages = Math.ceil(res.total / this.size);
    //});
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
        this.categories = categories;
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

  editProduct(product: any): void {
    console.log('Editing:', product);
    this.fetchCategories();
  }

  removeProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      //this.productService.deleteProduct(id).subscribe(() => this.fetchProducts());
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
    this.previewImage = null;
    this.newProduct = { name: '', description: '', categoryId: null, imageFile: null };
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newProduct.imageFile = file;
      this.previewImage = URL.createObjectURL(file);
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
    console.log('Submitting', this.newProduct);
    // Upload logic here...
    this.cancelAddProduct();
  }

}
