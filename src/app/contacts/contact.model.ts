export interface Telephone {
    number: string;
    type: string;
}

export interface Address {
    street: string;
    city: string;
    country: string;
    type: string;
}

export interface Contact {
    contactId: string;
    firstName: string;
    lastName: string;
    birthday: Date;
    telephones: Telephone[];
    addresses: Address[];
}
