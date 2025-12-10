"use client";

import NothingFound from "@/components/common/NothingFound";
import React from "react";

interface IBudget {
  expense: string;
  expecte_expense_head: string;
}

interface IBudgetProps {
  budget: IBudget[];
}

const Budget: React.FC<IBudgetProps> = ({ budget }) => {
  return (
    <div className="w-full bg-white rounded-lg">
      <div className="p-4 space-y-4">
        {budget.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <NothingFound text="No budget found" />
          </div>
        ) : (
          budget.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-dashed border-gray-300 pb-3"
            >
              <div className="flex flex-col ">
                <p className="text-sm font-semibold text-gray-700">Expense Head {index+1}</p>
                <p className="text-sm font-semibold text-gray-700">Expense </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm font-bold text-gray-900">
                  {item.expecte_expense_head||""}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {item.expense||""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Budget;
