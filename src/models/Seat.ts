export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
}

export class Seat {
  constructor(
    public id: string,
    public price: number,
    public type: 'REGULAR' | 'PREMIUM',
    public status: SeatStatus = SeatStatus.AVAILABLE
  ) {}

  toJSON() {
    return {
      id: this.id,
      price: this.price,
      type: this.type,
      status: this.status,
    };
  }

  static fromJSON(data: any): Seat {
    return new Seat(data.id, data.price, data.type, data.status);
  }

  static generateSeatMap(): Seat[] {
    const seats: Seat[] = [];
    const rows = ["A", "B", "C"];
    const seatsPerRow = 10;
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push(
          new Seat(
            `${row}${i}`,
            row === "A" ? 200 : 100,
            row === "A" ? "PREMIUM" : "REGULAR",
            SeatStatus.AVAILABLE
          )
        );
      }
    });
    return seats;
  }
}