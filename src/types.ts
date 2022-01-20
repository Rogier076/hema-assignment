import { ITransaction } from "./interface/ITransaction";
import { IUser } from "./interface/IUser";

export type CSVTransactionLine = ITransaction & Pick<IUser, "uid">;
