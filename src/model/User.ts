import { ITransaction } from "../interface/ITransaction";
import { IUser } from "../interface/IUser";
import { Transaction } from "./Transaction";

export class User implements IUser {
  public constructor(
    public uid: string,
    private _transactions: Transaction[] = [],
    public cutOffDate = new Date("2021-01-01T00:00:00+0100") //actually the assignement is inconsistent here. //Sometimes it tells to calauclate bnalance on jan 1, 2021 and the non 2022. // We take 2021 as cutoff, but both result in negative balance
  ) {}

  public get transactions() {
    return [...this._transactions].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    ); //could cache this somehow
    //prevent from writing
  }

  public getTransactionsBefore = (date: Date) =>
    this.transactions.filter((v) => date.getTime() > v.date.getTime());

  public getTransacionsAfter = (date: Date, includeGivenDate = true) =>
    this.transactions.filter(
      (v) => date.getTime() - (includeGivenDate ? 1 : 0) < v.date.getTime()
    );
  //we could create a intermediate class that can hold transactions and a getter for the balance.
  //we then could create instances of that class here for the filtered values
  public get balance() {
    const oldBalance = this.getTransactionsBefore(this.cutOffDate).reduce(
      (prev, next) => prev + next.mutation,
      0
    );
    const newBalance = this.getTransacionsAfter(this.cutOffDate, true).reduce(
      (prev, next) => prev + next.mutation,
      0
    );
    return oldBalance >= 0 ? newBalance : newBalance - oldBalance;
  }

  public addTransaction = (transaction: ITransaction) => {
    this._transactions.push(
      transaction instanceof Transaction
        ? transaction
        : Transaction.fromInterface(transaction)
    );
    return this;
  };
  public removeTransaction = (timestamp: Date) => {
    const idx = this._transactions.findIndex(
      (v) => v.date.getTime() === timestamp.getTime()
    );
    if (idx !== -1) this._transactions.splice(idx, 1);
    return this;
  };
}
