import { DollarSign } from 'lucide-react';

interface Payment {
  id: number;
  restaurant: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

const payments: Payment[] = [
  {
    id: 1,
    restaurant: "Bella Italia",
    amount: "$299.99",
    status: "completed",
    date: "2024-03-10"
  },
  {
    id: 2,
    restaurant: "Sushi Master",
    amount: "$199.99",
    status: "pending",
    date: "2024-03-08"
  },
  {
    id: 3,
    restaurant: "Burger House",
    amount: "$299.99",
    status: "failed",
    date: "2024-03-05"
  }
];

export function Payments() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary-indigo mb-8">Payment History</h1>
        <div className="bg-base rounded-lg shadow-sm border border-primary/10">
          <div className="p-6 border-b border-primary/10 flex items-center">
            <DollarSign className="w-6 h-6 text-secondary-gold mr-2" />
            <h2 className="text-lg font-semibold text-secondary-indigo">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-primary/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-indigo">{payment.restaurant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${payment.status === 'completed' ? 'bg-secondary/20 text-secondary' : 
                          payment.status === 'pending' ? 'bg-secondary-gold/20 text-secondary-gold' : 
                          'bg-primary-red/20 text-primary-red'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                      {payment.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}