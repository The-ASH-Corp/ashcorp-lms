export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
    constructor(
        public categoryName:string,
        public color:string,
        public iconUrl:string,
        public id?:string
    ){}
}