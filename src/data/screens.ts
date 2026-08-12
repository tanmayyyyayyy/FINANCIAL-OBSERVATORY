export interface StitchScreen {
    id: string;
    name: string;
    category: string;
    desktop: string;
    mobile?: string;
}

const base = "/stitch_financial_observatory_terminal";

export const stitchScreens: StitchScreen[] = [
    {
        id: "landing",
        name: "Landing Page",
        category: "Marketing",
        desktop: `${base}/landing_page_financial_observatory_desktop/code.html`,
        mobile: `${base}/landing_page_financial_observatory_mobile/code.html`,
    },

    {
        id: "login",
        name: "Login",
        category: "Authentication",
        desktop: `${base}/login_financial_observatory_desktop/code.html`,
        mobile: `${base}/login_financial_observatory_mobile/code.html`,
    },

    {
        id: "signup",
        name: "Sign Up",
        category: "Authentication",
        desktop: `${base}/sign_up_financial_observatory_desktop/code.html`,
        mobile: `${base}/sign_up_financial_observatory_mobile/code.html`,
    },

    {
        id: "dashboard",
        name: "Financial Observatory Dashboard",
        category: "Core",
        desktop: `${base}/dashboard_financial_observatory_desktop/code.html`,
        mobile: `${base}/dashboard_financial_observatory_mobile/code.html`,
    },

    {
        id: "onboarding-welcome",
        name: "Onboarding — Welcome",
        category: "Onboarding",
        desktop: `${base}/onboarding_welcome_desktop/code.html`,
        mobile: `${base}/onboarding_welcome_mobile/code.html`,
    },

    {
        id: "onboarding-profile",
        name: "Onboarding — Financial Profile",
        category: "Onboarding",
        desktop: `${base}/onboarding_financial_profile_desktop/code.html`,
        mobile: `${base}/onboarding_financial_profile_mobile/code.html`,
    },

    {
        id: "onboarding-categories",
        name: "Onboarding — Expense Categories",
        category: "Onboarding",
        desktop: `${base}/onboarding_expense_categories_desktop/code.html`,
        mobile: `${base}/onboarding_expense_categories_mobile/code.html`,
    },

    {
        id: "onboarding-budget",
        name: "Onboarding — Budget",
        category: "Onboarding",
        desktop: `${base}/onboarding_budget_desktop/code.html`,
        mobile: `${base}/onboarding_budget_mobile/code.html`,
    },

    {
        id: "onboarding-complete",
        name: "Onboarding — Complete",
        category: "Onboarding",
        desktop: `${base}/onboarding_complete_desktop/code.html`,
        mobile: `${base}/onboarding_complete_mobile/code.html`,
    },

    {
        id: "add-expense",
        name: "Add Expense",
        category: "Transactions",
        desktop: `${base}/add_expense_desktop/code.html`,
        mobile: `${base}/add_expense_mobile/code.html`,
    },

    {
        id: "category-selection",
        name: "Category Selection",
        category: "Transactions",
        desktop: `${base}/category_selection_desktop/code.html`,
    },

    {
        id: "transaction-success",
        name: "Transaction Success",
        category: "Transactions",
        desktop: `${base}/transaction_success_desktop/code.html`,
    },

    {
        id: "ledger",
        name: "Detailed Ledger",
        category: "Transactions",
        desktop: `${base}/detailed_ledger_desktop/code.html`,
        mobile: `${base}/detailed_ledger_mobile/code.html`,
    },

    {
        id: "ledger-search",
        name: "Ledger Search & Filters",
        category: "Transactions",
        desktop: `${base}/ledger_search_filters_desktop/code.html`,
    },

    {
        id: "ledger-filter-mobile",
        name: "Mobile Filter Sheet",
        category: "Transactions",
        desktop: `${base}/ledger_mobile_filter_sheet/code.html`,
    },

    {
        id: "ledger-empty",
        name: "Empty Ledger",
        category: "Transactions",
        desktop: `${base}/ledger_empty_state_desktop/code.html`,
    },

    {
        id: "transaction-delete",
        name: "Transaction Detail / Delete",
        category: "Transactions",
        desktop: `${base}/transaction_detail_delete_desktop/code.html`,
    },

    {
        id: "edit-expense",
        name: "Edit / Delete Expense",
        category: "Transactions",
        desktop: `${base}/edit_expense_delete_mobile/code.html`,
    },

    {
        id: "budget-control",
        name: "Budget Control",
        category: "Budgets",
        desktop: `${base}/budget_control_desktop/code.html`,
        mobile: `${base}/budget_control_mobile/code.html`,
    },

    {
        id: "create-budget",
        name: "Create Budget",
        category: "Budgets",
        desktop: `${base}/create_budget_desktop/code.html`,
    },

    {
        id: "budget-detail",
        name: "August Budget Detail",
        category: "Budgets",
        desktop: `${base}/budget_detail_august_desktop/code.html`,
    },

    {
        id: "budget-performance",
        name: "Budget Performance Report",
        category: "Budgets",
        desktop: `${base}/budget_performance_report_desktop/code.html`,
    },

    {
        id: "budget-empty",
        name: "Budget & Goals Empty States",
        category: "Budgets",
        desktop: `${base}/budgeting_goals_empty_states_desktop/code.html`,
    },

    {
        id: "goals",
        name: "Financial Goals",
        category: "Goals",
        desktop: `${base}/financial_goals_desktop/code.html`,
        mobile: `${base}/financial_goals_mobile/code.html`,
    },

    {
        id: "goal-detail",
        name: "Emergency Fund Goal",
        category: "Goals",
        desktop: `${base}/goal_detail_emergency_fund_desktop/code.html`,
    },

    {
        id: "prediction-engine",
        name: "Prediction Engine",
        category: "Intelligence",
        desktop: `${base}/prediction_engine_desktop/code.html`,
        mobile: `${base}/prediction_engine_mobile/code.html`,
    },

    {
        id: "prediction-insufficient",
        name: "Prediction — Insufficient Data",
        category: "Intelligence",
        desktop: `${base}/prediction_engine_insufficient_data_desktop/code.html`,
    },

    {
        id: "investments",
        name: "Investment Observatory",
        category: "Investments",
        desktop: `${base}/investment_observatory_desktop/code.html`,
        mobile: `${base}/investment_observatory_mobile/code.html`,
    },

    {
        id: "investment-detail",
        name: "Investment Detail",
        category: "Investments",
        desktop: `${base}/investment_detail_hdfc_flexi_cap_desktop/code.html`,
        mobile: `${base}/investment_detail_hdfc_flexi_cap_mobile/code.html`,
    },

    {
        id: "record-investment",
        name: "Record Investment",
        category: "Investments",
        desktop: `${base}/record_investment_desktop/code.html`,
    },

    {
        id: "investment-recorded",
        name: "Investment Recorded",
        category: "Investments",
        desktop: `${base}/investment_recorded_desktop/code.html`,
    },

    {
        id: "portfolio-intelligence",
        name: "Portfolio Intelligence",
        category: "Investments",
        desktop: `${base}/portfolio_intelligence_desktop/code.html`,
    },

    {
        id: "empty-portfolio",
        name: "Empty Portfolio",
        category: "Investments",
        desktop: `${base}/empty_portfolio_desktop/code.html`,
    },

    {
        id: "wealth",
        name: "Wealth Projection",
        category: "Wealth",
        desktop: `${base}/wealth_projection_desktop/code.html`,
    },

    {
        id: "net-worth",
        name: "Net Worth Breakdown",
        category: "Wealth",
        desktop: `${base}/net_worth_breakdown_desktop/code.html`,
    },

    {
        id: "net-worth-statement",
        name: "Net Worth Statement",
        category: "Wealth",
        desktop: `${base}/net_worth_statement_desktop/code.html`,
    },

    {
        id: "financial-insights",
        name: "Financial Insights",
        category: "Intelligence",
        desktop: `${base}/financial_insights_desktop/code.html`,
    },

    {
        id: "reports",
        name: "Reports Overview",
        category: "Reports",
        desktop: `${base}/reports_overview_desktop/code.html`,
        mobile: `${base}/reports_overview_mobile/code.html`,
    },

    {
        id: "financial-overview",
        name: "Financial Overview Report",
        category: "Reports",
        desktop: `${base}/financial_overview_report_desktop/code.html`,
    },

    {
        id: "expense-analysis",
        name: "Expense Analysis",
        category: "Reports",
        desktop: `${base}/expense_analysis_report_desktop/code.html`,
    },

    {
        id: "investment-report",
        name: "Investment Report",
        category: "Reports",
        desktop: `${base}/investment_report_desktop/code.html`,
    },

    {
        id: "export-report",
        name: "Export Report",
        category: "Reports",
        desktop: `${base}/export_report_desktop/code.html`,
    },

    {
        id: "report-generated",
        name: "Report Generated",
        category: "Reports",
        desktop: `${base}/report_generated_desktop/code.html`,
    },

    {
        id: "report-archive",
        name: "Report Archive",
        category: "Reports",
        desktop: `${base}/report_archive_desktop/code.html`,
    },

    {
        id: "empty-reports",
        name: "Empty Reports",
        category: "Reports",
        desktop: `${base}/empty_reports_state_desktop/code.html`,
    },
];