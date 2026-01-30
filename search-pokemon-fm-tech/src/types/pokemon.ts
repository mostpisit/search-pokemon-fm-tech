export type Attack = {
  name: string;
  type?: string | null;
  damage?: number | null;
};

export type Attacks = {
  fast: Attack[];
  special: Attack[];
};

export type Pokemon = {
  id: string;
  number?: string;
  name: string;
  image?: string | null;
  classification?: string | null;
  types?: string[] | null;
  resistant?: string[] | null;
  weaknesses?: string[] | null;
  weight?: { minimum?: string | null; maximum?: string | null } | null;
  height?: { minimum?: string | null; maximum?: string | null } | null;
  attacks?: Attacks | null;
  evolutions?: Array<{
    id?: string;
    number?: string;
    name?: string;
    image?: string | null;
    types?: string[] | null;
  }> | null;
};
