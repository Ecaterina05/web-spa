import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

//Component that displays the existing contacts
@Component({
  selector: 'app-contact-agenda',
  templateUrl: './contact-agenda.component.html',
  styleUrls: ['./contact-agenda.component.css']
})
export class ContactAgendaComponent implements OnInit {

  allContacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  sortedContacts: Contact[] = [];

  constructor(private contactService: ContactService, private route: ActivatedRoute) { }

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredContacts = this.listFilter ? this.performFilter(this.listFilter) : this.allContacts;
  }

  _selectedSortingMethod = '';
  get selectedSortingMethod(): string {
    return this._selectedSortingMethod;
  }
  set selectedSortingMethod(value: string) {
    this._selectedSortingMethod = value;
    this.selectedSortingMethod ? this.performSorting(this.selectedSortingMethod) : this.filteredContacts;
  }

  ngOnInit(): void {
    this.listFilter = this.route.snapshot.queryParamMap.get('filterBy') || '';
    this.selectedSortingMethod = this.route.snapshot.queryParamMap.get('selectedSortingMethod') || '';

    this.contactService.getList().subscribe(
      (data: Contact[]) => {
        this.allContacts = <Contact[]>data,
          this.filteredContacts = this.performFilter(this.listFilter)
        this.sortedContacts = this.performSorting(this.selectedSortingMethod)
        console.log(data)
      },
      (err) => console.log(err),
      () => { console.log('Completed getting all contacts!') }
    );

  }

  performFilter(filterBy: string): Contact[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.allContacts.filter((contact: Contact) =>
      contact.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performSorting(sortBy: string): Contact[] {
    console.log(sortBy)
    if (sortBy === "none") {
      this.filteredContacts = this.allContacts;
      return this.filteredContacts;
    }
    if (sortBy === "firstname") {
      // this.filteredContacts.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
      // let firstLetter: Contact = {contactId: "", firstName: this.filteredContacts[0].firstName[0], lastName: "", birthday: new Date(0), telephones: [], addresses: []}
      // this.sortedContacts.push(firstLetter);
      // for(let i = 1; i < this.filteredContacts.length; i++) {
      //   if(this.filteredContacts[i].firstName[0] !== firstLetter.firstName) {
      //     firstLetter.firstName = this.filteredContacts[i].firstName[0];
      //     this.sortedContacts.push(firstLetter);
      //   }
      //   else {
      //     this.sortedContacts.push(this.filteredContacts[i]);
      //   }
      // }
      // this.filteredContacts = [...this.sortedContacts]
      return this.filteredContacts.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
    }

    if (sortBy === "lastname") {
      return this.filteredContacts.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
    }

    if (sortBy === "age") {
      return this.filteredContacts.sort(function (a, b) {
        let timeDiff_a = Math.abs(Date.now() - new Date(a.birthday).getTime());
        let timeDiff_b = Math.abs(Date.now() - new Date(b.birthday).getTime());
        let age_a = Math.floor((timeDiff_a / (1000 * 3600 * 24)) / 365);
        let age_b = Math.floor((timeDiff_b / (1000 * 3600 * 24)) / 365);
        return age_a - age_b;
      })
    }

    if (sortBy === "dateOfBirth") {
      return this.filteredContacts.sort(function (a, b) { return new Date(a.birthday).getTime() - new Date(b.birthday).getTime(); })
    }

    else {
      return this.filteredContacts;
    }
  }

}
