import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../models/category/category';
import { AuthService } from '../../services/auth-service/auth.service';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';

@Component({
  selector: 'app-moderator',
  standalone: false,
  templateUrl: './moderator.component.html',
  styleUrl: './moderator.component.css'
})
export class ModeratorComponent implements OnInit {
  products: any[] = [];
  page = 1;
  size = 5;
  totalPages = 1;
  constructor(private productService: ProductService, private authService: AuthService,
    private supplierService: SupplierService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCompanies();
    this.fetchProducts();
  }

  fetchCompanies(): void {
    if (this.authService.roleOfUser() === 'Moderator') {
      this.supplierService.getUserSuppliers().subscribe(companies => {
        console.log(companies);
      });
    }
    if (this.authService.roleOfUser() === 'Admin') {
      this.supplierService.getAllSuppliers().subscribe(companies => {
        console.log(companies);
      });
    }
  }

  fetchProducts(): void {
    //this.productService.getPagedProducts(this.page, this.size).subscribe(res => {
    //  this.products = res.items;
    //  this.totalPages = Math.ceil(res.total / this.size);
    //});
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
    // route to edit page or open modal
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


  companies = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    { id: 3, name: 'Company C' }
  ];

  selectedCompanyId = this.companies[0].id;

  onCompanyChange(): void {
    console.log('Selected Company ID:', this.selectedCompanyId);
    this.page = 1;
    this.fetchProducts(); // optionally refetch data based on selected company
  }

  showAddModal = false;
  previewImage: string | null = null;

  newProduct = {
    name: '',
    description: '',
    categoryId: null,
    imageFile: null
  };

  categories = [
    { id: 1, name: 'Clothing' },
    { id: 2, name: 'Electronics' },
    { id: 3, name: 'Accessories' }
  ];

  addProduct(): void {
    this.showAddModal = true;
    console.log("hey")
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
