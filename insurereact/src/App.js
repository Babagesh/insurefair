import "./App.css";
import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    monthlyPayment: "",
    reimbursement: "",
  });
  const [resultsList, setResultsList] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert input values to numbers
    const monthlyPayment = parseFloat(formData.monthlyPayment);
    const reimbursement = parseFloat(formData.reimbursement);
    const age = parseInt(formData.age, 10);

    // Determine life expectancy based on gender
    let lifeExpectancy;
    if (formData.gender === "Male") {
      lifeExpectancy = 74.8;
    } else if (formData.gender === "Female") {
      lifeExpectancy = 80.2;
    } else {
      lifeExpectancy = (74.8 + 80.2) / 2; // average for "Other"
    }

    // Calculate total payments
    const totalPayments = monthlyPayment * 12 * (lifeExpectancy - age);

    // Calculate user profit
    const userProfit = reimbursement - totalPayments;

    // Calculate break-even point in months (based only on payments and reimbursement)
    const breakEvenMonths = reimbursement / monthlyPayment;

    // Calculate remaining life expectancy in months
    const remainingLifeMonths = (lifeExpectancy - age) * 12;

    // Determine break-even message
    let breakEvenMessage = "";
    if (breakEvenMonths > remainingLifeMonths) {
      breakEvenMessage = `You will not reach the break-even point during your expected lifetime, which is a good thing for life insurance.`;
    } else {
      breakEvenMessage = `You will break even in ${breakEvenMonths.toFixed(
        0
      )} months, within your expected lifetime.`;
    }

    // Determine rating based on user profit and break-even point
    let rating = "";
    if (userProfit >= 0) {
      rating = "Good"; // If user profit is positive, it's always good
    } else if (breakEvenMonths > remainingLifeMonths) {
      rating = "Good"; // If they don’t reach break-even, it's also good
    } else if (userProfit < 0 && Math.abs(userProfit) <= 0.1 * totalPayments) {
      rating = "Medium"; // If the loss is less than 10% of total payments, it's medium
    } else {
      rating = "Bad"; // If they reach break-even early and have significant loss
    }

    // Determine if it's a profit or deficit
    let profitOrDeficit = "";
    if (userProfit >= 0) {
      profitOrDeficit = `User Profit: $${userProfit.toFixed(2)}`;
    } else {
      profitOrDeficit = `User Deficit: $${Math.abs(userProfit).toFixed(2)}`;
    }

    // Create the result object
    const result = {
      plan: `Plan ${resultsList.length + 1}`,
      profitOrDeficit: profitOrDeficit,
      breakEvenMessage: breakEvenMessage,
      rating: rating,
    };

    // Update the results list
    setResultsList([...resultsList, result]);
  };

  return (
    <div className="App">
      <header className="hero">
        <h1>InsureFair</h1>
        <p className="slogan">Empowering You with Fair Insurance Choices</p>
      </header>

      {/* Content Boxes */}
      <section className="box">
        <h2>
          Welcome to <b>InsureFair:</b> Empowering Your Financial Future!
        </h2>
        <p>
          Through InsureFair, we believe that everyone will have access to fair
          and transparent insurance options, regardless of their background.
        </p>
      </section>

      <section className="box">
        <h2>Are You Getting the Coverage You Deserve?</h2>
        <p>
          <b>
            Did you know that nearly 20% of Black and Latino Americans are
            uninsured or underinsured?
          </b>{" "}
          This means many families may be paying too much for inadequate
          coverage, or worse, going without insurance altogether.
        </p>
      </section>

      <section className="box">
        <p>
          <b>Don't let your hard-earned money go to WASTE!</b> With our
          easy-to-use platform, you can quickly assess whether your current
          insurance plan is working for you.
        </p>
      </section>

      <section className="box">
        <p>
          <b>Take control of your financial future TODAY!</b> Discover if you’re
          being scammed or if you’re eligible for better coverage options.
        </p>
      </section>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gender">Gender: </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="age">Age: </label>
          <input
            type="number"
            id="age"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="monthlyPayment">Monthly Payment ($): </label>
          <input
            type="number"
            id="monthlyPayment"
            placeholder="Enter payment"
            value={formData.monthlyPayment}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="reimbursement">Reimbursement on Death ($): </label>
          <input
            type="number"
            id="reimbursement"
            placeholder="Enter reimbursement"
            value={formData.reimbursement}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Find Results</button>
      </form>

      {/* Results Section */}
      {resultsList.length > 0 && (
        <div className="results-container">
          <h2>Your Plans</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Profit/Deficit</th>
                <th>Break-even Point</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {resultsList.map((result, index) => (
                <tr key={index}>
                  <td>{result.plan}</td>
                  <td>{result.profitOrDeficit}</td>
                  <td>{result.breakEvenMessage}</td>
                  <td className={`rating ${result.rating.toLowerCase()}`}>
                    {result.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="edit-message">
            You can edit your inputs above and resubmit to compare more plans.
          </p>
        </div>
      )}

      {/* Information Section - Both Profit/Deficit and Break-even */}
      <section className="info-section-small box">
        <h3>Profit or Deficit Information</h3>
        <p>
          The profit or deficit calculation shows how much you stand to gain
          (profit) or lose (deficit) from your current insurance plan over your
          expected lifetime. A positive number indicates a profit, meaning the
          insurance plan will pay out more than you contribute. A negative
          number represents a deficit, meaning you are paying more into the plan
          than you will receive in return.
        </p>
      </section>

      <section className="info-section-small box">
        <h3>Break-even Information</h3>
        <p>
          The break-even point helps you understand how long it will take for
          your total payments to match the reimbursement you will receive. If
          the break-even point occurs after your expected lifetime, it's
          actually a good thing for life insurance, as it means you will have
          paid less and your beneficiaries will still receive the full payout.
        </p>
      </section>

      <footer>
        <img
          src="https://i.imgur.com/U5lwggF.png"
          alt="InsureFair Logo"
          width="150"
        />
        <p>© 2024 InsureFair. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
