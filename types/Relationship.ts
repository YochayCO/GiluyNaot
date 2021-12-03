import Person from './Person';

type RelationType = 'married' | 'divorced' | 'friends' | 'business_partners' | 'associates' | 'parent_of' | 'siblings';

export default interface Relationship {
    id: string;
    relative_1: Person;
    relative_2: Person;
    relationType: RelationType;
}
