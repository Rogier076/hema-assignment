import fs, { ReadStream } from "fs";
import csv from "csv-parser";
import type { Transform } from "stream";
import { LoyaltyUsers } from "../model/LoyaltyUsers";

//could split this in multiple files / classes, generic filereader, csv reader, transaction csv reader. Eiter nest the functions or extend the classes.
export class TransactionFileReader {
  private _stream: ReadStream;
  private _pipe: Transform;
  public constructor(public readonly filename: string) {
    if (!fs.existsSync(filename)) {
      throw new Error("file does not exist");
    }
    this._stream = fs.createReadStream(this.filename);
    this._pipe = this._stream.pipe(csv(["uid", "date", "mutation"]));
    this._pipe.pause();
  }

  private _onLine = (data: string[]) => {};

  public readTransactionFileAsync = (): Promise<LoyaltyUsers> => {
    const users = new LoyaltyUsers();
    return new Promise((resolve, reject) => {
      this._pipe.on("end", () => resolve(users));
      this._pipe.on("error", reject);
      //of course we should always check if data is correct but we skip that here.
      this._pipe.on("data", (data) => users.processTransactionLine(data));
      this._pipe.isPaused() && this._pipe.resume();
    });
  };
}
