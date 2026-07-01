export class Course {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public price: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
