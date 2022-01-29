import Company from './Company';
import { CompanyOwnership, Ownership } from './Ownerships';
import Relationship from './Relationship';
import Person from './Person';

export interface GraphEntities {
    people?: Person[];
    companies?: Company[];
    companyOwnerships?: CompanyOwnership[];
    ownerships?: Ownership[];
    relationships?: Relationship[];
}
