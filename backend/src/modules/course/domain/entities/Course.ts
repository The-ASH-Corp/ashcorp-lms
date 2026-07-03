export class Course {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public price: number,
    public instructor: string,
    public category: string,
    public level: string,
    public rating: number,
    public duration: string,
    public language: string,
    public imageUrl: string,
    public videoUrl: string,
    public tags: string[],
    public chapters: string[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
