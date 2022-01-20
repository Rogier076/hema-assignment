import { ILoyaltyUsers } from "../interface/ILoyaltyUsers";
import { CSVTransactionLine } from "../types";
import { User } from "./User";

export class LoyaltyUsers implements ILoyaltyUsers {
  public constructor(private _list: User[] = []) {}

  public get list() {
    return [...this._list];
  }

  public processTransactionLine = (line: CSVTransactionLine) => {
    const { uid, ...transaction } = line;
    const user = this._list.find((v) => v.uid === uid);
    if (user) user.addTransaction(line);
    else this._list.push(new User(uid).addTransaction(transaction));
  };
}
