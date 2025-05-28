import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../models/category/category';
import { AuthService } from '../../services/auth-service/auth.service';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Supplier } from '../../models/supplier/supplier';
import { Product } from '../../models/product/product';
import { AttributeCat } from '../../models/attribute-cat/attribute-cat';

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
  selectedAttributeId: number | null = null;
  availableAttributes: AttributeCat[] = [];

  newProduct = {
    id: null as number | null,
    name: '',
    description: '',
    categoryId: null as number | null,
    imageFiles: [] as File[],
    price: null as number | null,
    stock: null as number | null,
    attributeValues: [] as {
      attributeId: number;
      name: string;
      typeOfFilter: string;
      value: string;
    }[]
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
    });
  }

  fetchCategories(afterLoadCallback?: () => void): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      if (!this.isEditMode) {
        this.newProduct.categoryId = this.categories[0]?.categoryId ?? null;
      }
      this.onCategoryChange()

      if (afterLoadCallback) {
        afterLoadCallback(); // safely call the callback after categories are loaded
      }
      
    });
  }

  onCategoryChange(): void {
    const selectedCat = this.categories.find(c => c.categoryId == this.newProduct.categoryId);
    console.log("gel", this.newProduct.categoryId, selectedCat, this.categories)
    if (selectedCat) {
      this.availableAttributes = selectedCat.attributes || [];
      console.log(this.availableAttributes)
      this.newProduct.attributeValues = [];
    }
  }

  addAttributeField(): void {
    if (this.selectedAttributeId == null) return;

    const selected = this.availableAttributes.find(attr => attr.id === this.selectedAttributeId);
    if (!selected) return;

    const alreadyExists = this.newProduct.attributeValues.some(av => av.attributeId === selected.id);
    if (alreadyExists) return;

    this.newProduct.attributeValues.push({
      attributeId: selected.id!,
      name: selected.name,
      typeOfFilter: selected.typeOfFilter,
      value: selected.typeOfFilter === 'Boolean' ? 'false' : ''
    });

    this.selectedAttributeId = null;
  }

  onBooleanChange(event: Event, attr: any) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      attr.value = input.checked ? 'true' : 'false';
    }
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
      stock: product.stock,
      attributeValues: []
    };
    console.log(product)
    this.fetchCategories(() => {
      const category = this.categories.find(c => c.categoryId == product.categoryId);
      if (category) {
        console.log("C",category)
        this.newProduct.attributeValues = product.attributes?.map((attr: any) => {
          const matchingAttr = category.attributes.find((catAttr: any) => catAttr.id == attr.attributeId);
          console.log("A", matchingAttr)
          return {
            attributeId: attr.attributeId,
            value: attr.value,
            name: matchingAttr?.name ?? 'Unknown',
            typeOfFilter: matchingAttr?.typeOfFilter ?? 'text'
          };
        }) || [];
      }
    });

    
    this.previewImages = product.images.map((image: any) => 'https://localhost:7060' + image.imageUrl);
    this.previewImagesAtTheStart = [...this.previewImages];
    this.isEditMode = true;
    this.showAddModal = true;

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
    this.fetchProducts();
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
      stock: null,
      attributeValues:[]
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
    const attributes = this.newProduct['attributeValues']
      .filter(attr => attr.value && attr.value.trim() !== '')
      .map(attr => ({ attributeId: attr.attributeId, value: attr.value }));

    console.log("atribute fra",attributes)
    const payload: Product = {
      id: this.newProduct.id!,
      name: this.newProduct.name,
      description: this.newProduct.description,
      categoryId: this.newProduct.categoryId!,
      supplierId: this.selectedCompanyId,
      price: this.newProduct.price!,
      stock: this.newProduct.stock!,
      attributes: attributes
    };
    console.log(payload)
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
