import { TransactionFileReader } from "./helper/fileReader";
import { TransactionAPIService } from "./service/APIService";

const run = async () => {
  const reader = new TransactionFileReader("./etc/transactions.csv");
  const users = await reader.readTransactionFileAsync();

  const apiService = new TransactionAPIService(
    "https://0vncp50tbg.execute-api.eu-central-1.amazonaws.com/prod",
    "CxgXMDsnKWatBHe31ygxU6pJbDmH6yup7YlGwDpP"
  );
  await apiService.handleUserSubmissionsAsync(users.list);
  //   await apiService.handleUserSubmissionsAsync(users.list.splice(0, 5));
};

run();
