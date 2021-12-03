export interface Role {
    name: string;
    type: string;
}

export default interface User {
    id: string;
    username: string;
    role: Role;
}
