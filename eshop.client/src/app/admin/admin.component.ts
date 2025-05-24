import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  moderators: any[] = [];
  page = 1;
  size = 5;
  totalPages = 1;
  constructor(private authService: AuthService, private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.fetchCompanies();
    this.fetchModerators();
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

  fetchModerators(): void {
    //this.supplierService.getPagedModerators(this.page, this.size).subscribe(res => {
    //  this.moderators = res.items;
    //  this.totalPages = Math.ceil(res.total / this.size);
    //});
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchModerators();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchModerators();
    }
  }

  removeModerator(id: number): void {
    if (confirm('Are you sure you want to delete this moderator?')) {
      //this.supplierService.deleteModerator(id).subscribe(() => this.fetchProducts());
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
    this.fetchModerators(); // optionally refetch data based on selected company
  }

  showAddModal = false;
  previewImage: string | null = null;

  newModerator = {
    id: -1,
    name: '',
    email: ''
  };

  addModerator(): void {
    this.showAddModal = true;
    console.log("hey")
  }

  cancelAddModerator(): void {
    this.showAddModal = false;
    this.previewImage = null;
    this.newModerator = { id: -1, email: '', name: '' };
  }

  checkNewModerator(): void {
    console.log('Checking e-mail: ' + this.newModerator.email)
    this.newModerator.id = 0; /// DEBUG
  }

  submitNewModerator(): void {
    if (this.newModerator.id < 0)
      return;
    console.log('Submitting', this.newModerator);
    // Upload logic here...
    this.cancelAddModerator();
  }
}
