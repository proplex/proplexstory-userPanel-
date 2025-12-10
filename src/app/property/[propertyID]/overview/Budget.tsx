"use client";

import dynamic from 'next/dynamic';

const Budget = dynamic(() => import("@/components/cards/BudgetCard/Budget"), { ssr: false });
const FandoraCrew = dynamic(() => import("@/components/cards/BudgetCard/FandoraCrew"), { ssr: false });

const BudgetDisplay = ({ budget }: { budget: any }) => {
    // Handle null or undefined budget

    return (
        <div className="space-y-6">
            <FandoraCrew title="Expected Budget" isCollapsible={true}>
                <Budget
                    budget={budget.map((budgetItem: any) => ({
                        expense: budgetItem?.expense || "N/A", // Fallback to "N/A" if missing
                        expecte_expense_head: budgetItem?.expecte_expense_head || "N/A",
                    }))}
                />
            </FandoraCrew>
        </div>
    );
};

export default BudgetDisplay;