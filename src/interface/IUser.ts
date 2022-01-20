import { ITransaction } from "./ITransaction";

export interface IUser {
  uid: string;
  transactions: ITransaction[];
  balance: number;
}
