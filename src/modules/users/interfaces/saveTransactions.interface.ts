export interface IResultSaveTransactions {
  id: number;
  amount: number;
  category: string;
  transactions_state: number;
  created_at: Date;
  updated_at?: Date;
}
