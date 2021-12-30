import Person from './Person';
export default interface Company {
    id: string;
    name: string;
    is_comm?: boolean;
    parent_relation?: Company;
    subsidiary_relations?: Company[];
    owner_relations?: Person;
    picture?: any;
    xPosition?: number;
    yPosition?: number;
    group_company?: { id: string };
    formal_name?: string;
    organization_type?: string;
    site_url?: string;
    tags?: string[];
    network_section_id?: number;
    contract_url?: string;
}
