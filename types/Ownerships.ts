import Person from './Person';
import Company from './Company';

export type OwnershipLevel = 'full' | 'partial';

export interface Ownership {
    id: string;
    owner?: Person;
    company?: Company;
    level: OwnershipLevel;
}

export interface CompanyOwnership {
    id: string;
    parent?: Company;
    subsidiary?: Company;
    level: OwnershipLevel;
}
