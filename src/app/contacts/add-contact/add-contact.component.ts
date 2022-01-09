import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, Contact, Telephone } from '../contact.model';
import { ContactService } from '../contact.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

//Component used for adding and editing contacts
@Component({
    templateUrl: './add-contact.component.html',
    styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

    form!: FormGroup

    firstName!: FormControl
    lastName!: FormControl
    birthday!: FormControl

    firstName_: string = "";
    lastName_: string = "";
    birthday_!: Date;
    addedNumbers: Telephone[] = [];
    addedAddresses: Address[] = [];

    editingMode: boolean = false;
    id!: string;

    constructor(private contactService: ContactService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id')!;
        console.log(this.id)
        if (this.id === '0') {
            this.editingMode = false;
        }
        else {
            this.editingMode = true;
            this.setForm(this.id)
        }

        this.firstName = new FormControl('', [Validators.required])
        this.lastName = new FormControl('', [Validators.required])
        this.birthday = new FormControl('', [Validators.required])

        this.form = new FormGroup({
            firstName: this.firstName,
            lastName: this.lastName,
            birthday: this.birthday
        })
    }

    setForm(id: string) {
        this.contactService.getContact(id).subscribe(
            (data: Contact) => {
                console.log(data);
                this.form.controls['firstName'].setValue(data.firstName);
                this.form.controls['lastName'].setValue(data.lastName);
                this.form.controls['birthday'].setValue(data.birthday);
                this.addedNumbers = data.telephones;
                this.addedAddresses = data.addresses;
            },
            (err) => console.log(err),
            () => console.log("Successfully got contact!")
        );
    }

    submit(formValue: { firstName: string; lastName: string; birthday: Date }) {

        var firstName_: string = formValue.firstName;
        var lastName_: string = formValue.lastName;
        var birthday_: Date = formValue.birthday;
        var addedNumbers_: Telephone[] = this.addedNumbers;
        var addedAddresses_: Address[] = this.addedAddresses;

        let newContact: Contact = { contactId: this.id, firstName: firstName_, lastName: lastName_, birthday: birthday_, telephones: addedNumbers_, addresses: addedAddresses_ };

        if (this.editingMode === false) {
            this.contactService.createContact(newContact).subscribe(
                (data: Contact) => console.log(data),
                (err) => console.log(err),
                () => console.log("Successfully added contact!")
            );

            this.toastr.success('Contact added!', 'Succes!');
            this.form.controls['firstName'].setValue('');
            this.form.controls['lastName'].setValue('');
            this.form.controls['birthday'].setValue('');
            this.addedNumbers = [];
            this.addedNumbers = [];
        }

        else {
            this.contactService.updateContact(newContact).subscribe();
            this.toastr.success('Contact updated!', 'Succes!');
        }
    }

    deleteContact() {
        this.contactService.deleteContact(this.id).subscribe();
        this.router.navigateByUrl('/contacts');
        this.toastr.info('Contact deleted!', 'Succes!');
    }

    addNumber() {
        this.addedNumbers.push({ number: (<HTMLInputElement>document.getElementById("number")).value, type: (<HTMLInputElement>document.getElementById("numberType")).value });
        console.log(this.addedNumbers);
        (<HTMLInputElement>document.getElementById("number")).value = "";
        (<HTMLInputElement>document.getElementById("numberType")).value = "Choose type...";
    }

    addAddress() {
        this.addedAddresses.push({
            street: (<HTMLInputElement>document.getElementById("street")).value, city: (<HTMLInputElement>document.getElementById("city")).value,
            country: (<HTMLInputElement>document.getElementById("country")).value, type: (<HTMLInputElement>document.getElementById("addressType")).value
        });
        console.log(this.addedNumbers);
        (<HTMLInputElement>document.getElementById("street")).value = "";
        (<HTMLInputElement>document.getElementById("city")).value = "";
        (<HTMLInputElement>document.getElementById("country")).value = "";
        (<HTMLInputElement>document.getElementById("addressType")).value = "Choose type...";
    }

}
