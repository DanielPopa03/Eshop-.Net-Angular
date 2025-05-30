import { Component } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse-products',
  standalone: false,
  templateUrl: './browse-products.component.html',
  styleUrl: './browse-products.component.css'
})
export class BrowseProductsComponent {
  categories: any[] = [];
  dynamicAttributes: any[] = [];
  pagedProducts: any[] = [];

  filters = {
    orderBy: 'ASC',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    stock: null as number | null,
    categoryId: null,
    pageIndex: 1,
    pageSize: 9,
  };

  totalPages = 1;
  currentPage = 1;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const categoryName = this.route.snapshot.queryParamMap.get('categoryName');
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
      if (categoryName) {
        const category = this.categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (category) {
          this.filters.categoryId = category.categoryId;
          this.onCategoryChange();
        }
      } 
    });
    this.onFilterChange();
  }

  onCategoryChange(): void {
    const selectedCategory = this.categories.find(c => c.categoryId == this.filters.categoryId);
    this.dynamicAttributes = selectedCategory?.attributes?.map((a: any) => ({
      ...a,
      values: [],
      value: false,
      min: null,
      max: null,
      search: '',
      options: [],         
      filteredOptions: []  
    })) || [];

    this.filters.pageIndex = 1;

    const attributeIds = this.dynamicAttributes.map(attr => attr.id);

    this.categoryService.getValuesForAttributes(attributeIds).subscribe(result => {
      const response = result as any[];
      for (const attr of this.dynamicAttributes) {
        const matching = response.find((r: any) => r.attributeId === attr.id);
        if (!matching) continue;

        //if (attr.typeOfFilter === 'Range' && matching.values?.length === 2) {
        //  attr.min = Number(matching.values[0]);
        //  attr.max = Number(matching.values[1]);
        //}

        if (['Dropdown', 'Search-Dropdown'].includes(attr.typeOfFilter)) {
          attr.options = matching.values || [];
          attr.filteredOptions = matching.values || [];
        }
      }
      this.onFilterChange();
    });
  }

  updateFilteredOptions(attr: any): void {
    attr.filteredOptions = (attr.options || []).filter((opt: string) =>
      opt.toLowerCase().includes(attr.search?.toLowerCase() || '')
    );
  }

  onMultiSelectChange(attr: any, value: string, event: any) {
    if (!attr.values) {
      attr.values = [];
    }

    if (event.target.checked) {
      if (!attr.values.includes(value)) {
        attr.values.push(value);
      }
    } else {
      attr.values = attr.values.filter((v: string) => v !== value);
    }

    this.onFilterChange();
  }


  onFilterChange(): void {
    if (this.filters.minPrice != null && this.filters.minPrice < 0) {
      this.filters.minPrice = 0;
    }

    if (this.filters.maxPrice != null && this.filters.maxPrice < 0)
      this.filters.maxPrice = 0;

    if (this.filters.minPrice != null && this.filters.maxPrice != null && this.filters.minPrice > this.filters.maxPrice) {
      this.filters.maxPrice = this.filters.minPrice;
    }

    if (this.filters.stock != null && this.filters.stock < 0) {
      this.filters.stock = null;
    }

    for (var dynamicAttr of this.dynamicAttributes)
      if (dynamicAttr.typeOfFilter == 'Range') {
        if (dynamicAttr.min != null && dynamicAttr.max != null && dynamicAttr.min > dynamicAttr.max)
          dynamicAttr.max = dynamicAttr.min;
      }

    const filterDto: any = {
      pageIndex: this.filters.pageIndex,
      pageSize: this.filters.pageSize,
      categoryId: this.filters.categoryId,
      orderBy: this.filters.orderBy,
      priceFilter: this.filters.minPrice != null && this.filters.maxPrice != null
        ? `${this.filters.minPrice}-${this.filters.maxPrice}` : null,
      stockFilter: this.filters.stock?.toString() || null,
      filters: this.dynamicAttributes.map(attr => {
        if (attr.typeOfFilter == 'Boolean') {
          return attr.value ? { attributeId: attr.id, values: ['true'] } : null;
        } else if (attr.typeOfFilter == 'Range') {
          return (attr.min != null && attr.max != null) ? {
            attributeId: attr.id,
            values: [attr.min.toString(), attr.max.toString()]
          } : null;
        } else {
          return attr.values?.length ? {
            attributeId: attr.id,
            values: attr.values
          } : null;
        }
      }).filter(f => f != null)
    };

    this.productService.getFilteredProducts(filterDto).subscribe((res: any) => {
      this.pagedProducts = res.items;
      this.totalPages = res.totalPages;
      this.currentPage = filterDto.pageIndex;
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.filters.pageIndex++;
      this.onFilterChange();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.filters.pageIndex--;
      this.onFilterChange();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.pageIndex = page;
      this.onFilterChange();
    }
  }


}
