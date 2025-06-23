export class Theatre {
  constructor(
    public id: string,
    public name: string,
    public location: string,
    public capacity: number
  ) {}

  getShowTimings(): string[] {
    return ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM']; // Stub
  }

  getTotalCapacity(): number {
    return this.capacity;
  }
}