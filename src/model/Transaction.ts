import { ITransaction } from "../interface/ITransaction";
import moment from "moment";

export class Transaction implements ITransaction {
  public constructor(public mutation: number, public date: Date) {}
  public static fromInterface = ({ mutation, date }: ITransaction) => {
    return new Transaction(
      parseInt(`${mutation}`, 10),
      // typeof date === "string" ? new Date(date) : date
      //using new date here switches month and day
      typeof date === "string"
        ? moment(date, "D-M-YYYY HH:mm:ss").toDate()
        : date
    );
  };
}
