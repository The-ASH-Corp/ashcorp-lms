export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}

export class Category {
    constructor(
        public categoryName:string,
        public color:string,
        public iconUrl:string,
        public isFeatured:boolean,
        public id?:string,
        public createdAt?:Date,
        public updatedAt?:Date
    ){}
}