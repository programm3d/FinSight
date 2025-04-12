const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Hashed
    preferences: {
        currency: { type: String, default: 'USD' },
        privacyMode: { type: Boolean, default: true },
        riskAppetite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        spendingStyle: { type: String, enum: ['conservative', 'moderate', 'high-spender'], default: 'moderate' },
    },
    createdAt: { type: Date, default: Date.now },
    ProfilePicture: { type: String }
});
const userModel=mongoose.model('User',UserSchema);


const IncomeSchema = new mongoose.Schema({
    source: String,
    amount: Number,
    frequency: { type: String, enum: ['monthly', 'yearly', 'weekly', 'one-time'] },
    startDate: Date,
    endDate: Date,
});

const ExpenseSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    frequency: { type: String, enum: ['monthly', 'yearly', 'weekly', 'one-time'] },
    startDate: Date,
    endDate: Date,
    isFixed: Boolean,
});

const InvestmentSchema = new mongoose.Schema({
    type: { type: String, enum: ['stocks', 'crypto', 'real_estate', 'mutual_funds', 'bonds', 'other'] },
    name: String,
    amountInvested: Number,
    expectedReturnRate: Number, // % annually
    startDate: Date,
});

const GoalSchema = new mongoose.Schema({
    name: String,
    targetAmount: Number,
    targetDate: Date,
    priority: { type: Number, default: 1 },
});

const DebtSchema = new mongoose.Schema({
    type: String, // e.g., "student loan"
    balance: Number,
    monthlyPayment: Number,
    interestRate: Number,
    endDate: Date,
});

const PastDecisionSchema = new mongoose.Schema({
    decisionType: String,
    impactEstimate: {
        shortTerm: Number,
        longTerm: Number,
    },
    retrospectiveCommentary: String,
    date: Date,
});

const UserFinancialProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', unique: true },
    incomes: [IncomeSchema],
    expenses: [ExpenseSchema],
    investments: [InvestmentSchema],
    debts: [DebtSchema],
    goals: [GoalSchema],
    pastDecisions: [PastDecisionSchema],
    cashBalance: { type: Number, default: 0 },
    emergencyFund: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
});

const userFinanceModel=mongoose.model('UserFinancialProfile', UserFinancialProfileSchema);


module.exports ={userModel,userFinanceModel};

