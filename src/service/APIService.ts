import Axios from "axios";
import { IUser } from "../interface/IUser";
import { LoyaltyUsers } from "../model/LoyaltyUsers";
import { User } from "../model/User";

//should split this service into one that handles generic api calls and one that processes

//even better: submit everything to AWS SQS, then use lambda to handle submissions to api based on queue (either poll, or use trigger)
//only remove successful submission from queue

export class TransactionAPIService {
  public constructor(public readonly endpoint: string, public apiKey: string) {}

  public submitBalanceAsync = (
    user: User //Omit<IUser, "transactions">
  ) => {
    const { uid: CustomerId, balance: Balance, transactions } = user;
    const date = transactions.length
      ? transactions[transactions.length - 1].date
      : new Date();
    return Axios.request({
      url: `/loyalty/${CustomerId}`,
      baseURL: this.endpoint,
      data: {
        CustomerId,
        Balance,
        Date: date.toString(), //already sorted
      },
      method: "PUT",
      headers: {
        "x-api-key": "CxgXMDsnKWatBHe31ygxU6pJbDmH6yup7YlGwDpP",
      },
      timeout: 5500, //give some extra rountrip time over 5000 ms
    });
  };

  public handleUserSubmissionsAsync = async (
    users: User[],
    retry = 0,
    maxRetry = 25
  ): Promise<void> => {
    const failed: User[] = [];
    console.log(
      `submitting ${
        users.length
      } for ${retry++} time out of ${maxRetry} max retries `
    );
    // for (const user of users) {
    for (let i = 0; i < users.length; i++) {
      //so we can log
      const user = users[i];
      console.log(`submitting user ${user.uid} (${i} of ${users.length})`);
      try {
        const result = await this.submitBalanceAsync(user);

        //we should check result body for errors on 200 return etc. but we skip that.
      } catch (e) {
        console.log(e);
        failed.push(user);
      }
      if (failed.length) {
        if (retry < maxRetry)
          return await this.handleUserSubmissionsAsync(failed, retry);
        throw new Error("Failed to often");
      }
    }
  };
}
