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
  totalPages = 0;
  constructor(private authService: AuthService, private supplierService: SupplierService, private userService: UserService) { }

  ngOnInit(): void {
    this.fetchCompanies();
    this.fetchModerators();
  }

  fetchCompanies(): void {
    if (this.authService.roleOfUser() === 'Admin') {
      this.supplierService.getAllSuppliers().subscribe(retrieved_companies => {
        console.log("Retrieved companies: " + retrieved_companies.toString());
        this.companies = retrieved_companies;
      });
    }
  }

  fetchModerators(): void {
    this.supplierService.getPagedModeratorsOfSupplier(this.selectedCompanyId, this.page, this.size).subscribe({
      next: res => {
        this.moderators = res.items;
        this.totalPages = Math.ceil(res.total / this.size);
      },
      error: err => {
        console.error('Failed to fetch moderators:', err);
        // optionally show user-friendly error message
      }
    });
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

  removeModerator(moderatorUserId: number): void {
    if (confirm('Are you sure you want to delete this moderator?')) {
      this.supplierService.deleteModeratorObservable(this.selectedCompanyId, moderatorUserId).subscribe(
        {
          next: (res: any) => { console.log(res); this.fetchModerators(); },
          error: (err: any) => { console.log(err); }
        }
      );
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
    console.log('Checking e-mail: ' + this.newModerator.email);

    this.userService.getUserByEmail(this.newModerator.email).subscribe({
      next: user => {
        console.log('User:', user);
        this.newModerator = user;
      },
      error: err => {
        if (err.status === 404) {
          console.log('User not found (404)');
          this.newModerator = { id: -1, email: '', name: '' };
        } else {
          console.error('HTTP Error:', err);
        }
      }
    });
  }


  submitNewModerator(): void {
    if (this.newModerator.id < 0)
      return;
    console.log('Submitting', this.newModerator);

    this.supplierService.addModeratorObservable(this.selectedCompanyId, this.newModerator.id).subscribe({
      next: (response) => {
        console.log("Success: ", response);
        this.fetchModerators();
      },
      error: (error) => {
        console.log("Error: ", error);
      }
    });;

    this.cancelAddModerator();

    this.fetchModerators();
  }
}
