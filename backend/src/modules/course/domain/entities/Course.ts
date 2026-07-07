export class Course {
  constructor(
    public title: string,
    public description: string,
    public price: number,
    public offerPrice: number,
    public instructor: string,
    public category: string,
    public imageUrl: string,
    public videoUrl: string,
    public createdAt: Date,
    public updatedAt: Date,
    public id?: string,
    public chapters?: string[],
  ) {}
}
