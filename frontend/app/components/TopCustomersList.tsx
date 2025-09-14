import React from "react";
import { Customer } from "../../lib/clientApiService";

interface TopCustomersListProps {
  customers: Customer[];
}

export default function TopCustomersList({ customers }: TopCustomersListProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">
        Top 5 Customers by Spend
      </h3>
      {customers.length > 0 ? (
        <ul className="space-y-2">
          {customers.map((customer, index) => (
            <li
              key={customer.id}
              className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-white/5 border-b"
              style={{ borderColor: "rgba(155, 57, 34, 0.3)" }}
            >
              <div className="flex items-center">
                <span
                  className="text-lg font-bold mr-4 w-6 text-center"
                  style={{ color: "#F2613F" }}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-white">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-200">
                ${(customer.totalSpend || 0).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center py-4">
          No customer spending data available yet.
        </p>
      )}
    </div>
  );
}
