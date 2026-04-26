import { Types } from "mongoose";
export interface Family {
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
    vanshId: string;
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
    vanshId: string;
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
    vanshId:string
}
export interface IGroup {
    _id: string;
    slug: string;
    name: string;
    nameHindi?: string;
    description?: string;
    tagline?: string;

    hero?: {
        title: string;
        subtitle: string;
        image: string;
    };

    history?: string;
    highlights?: string[];

    quote?: {
        text: string;
        author: string;
    };

    cta?: {
        label: string;
        route: string;
    };
}

export interface Vansh {
    _id: string;
    name: VanshName;
    slug: string;
    color: {
        bg: string;
        text: string;
        border: string;
    };
}

export interface Clan {
    id: string;
    name: string;
    altName: string;
    description: string;
    origin: string;
    kuldevi: string;
    subclans: string[];
    accent: string;
    vansh?: Vansh;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    clans: Clan[];
}
export interface PersonNode extends Family {
    childrenData: PersonNode[];
    spouseData: PersonNode[];
    parentData?: PersonNode[]; // 👈 ADD THIS
}

//Types-------------------------------------
export type ParentId = string | null;
export type VanshName = "Agnivanshi" | "Chandravanshi" | "Suryavanshi";
