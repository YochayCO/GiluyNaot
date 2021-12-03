import Company from './Company';
import { CompanyOwnership, Ownership } from './Ownerships';
import Relationship from './Relationship';
import Person from './Person';

export interface Entities {
    people?: Person[];
    companies?: Company[];
    companyOwnerships?: CompanyOwnership[];
    ownerships?: Ownership[];
    relationships?: Relationship[];
}
