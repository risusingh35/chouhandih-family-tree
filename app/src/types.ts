export interface Person {
    id: string;
    name: string;
    gender: "M" | "F";
    photo: string;
    dob: string;
    death: string | null;
    isMarried: boolean;
    isAlive: boolean;
    isApproved: boolean;
    spouse: string[];
    parents: string[] | null;
    children: string[];
}
export interface ChildNode {
    id: string;
    name: string;
    gender: "M" | "F";
    photo: string;
    dob: string;
    death: string;
    isMarried: boolean;
    spouse: string[];
    isAlive: boolean;
    isApproved: boolean;
    parents: string[] | null;
    children: string[];
    childrenData: ChildNode[];
    spouseData: unknown[];
}
export interface PersonNode extends Person {
    childrenData: PersonNode[];
    spouseData: PersonNode[];
}
export interface ChildNode {
    id: string;
    name: string;
    gender: "M" | "F";
    photo: string;
    dob: string;
    death: string;
    isMarried: boolean;
    spouse: string[];
    isAlive: boolean;
    parents: string[] | null;
    children: string[];
    childrenData: ChildNode[];
    spouseData: unknown[];
}

export interface FormData {
    name: string;
    gender: "M" | "F";
    photo: string;
    dob: string;
    death: string;
    isMarried: boolean;
    spouse: string[];
    isAlive: boolean;
}

export interface FormErrors {
    name?: string;
    dob?: string;
    death?: string;
}

export interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    parentId: ParentId;
    onSave: (child: ChildNode) => void;
}
//Types-------------------------------------
export type ParentId = string | null;