import React, { useEffect, useState } from "react";

function Temp() {
  const [baseCountry, setBaseCountry] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [error, setError] = useState("");

  const countryToCurrency = {
    India: "INR",
    USA: "USD",
    UAE: "AED",
    Japan: "JPY",
    UK: "GBP",
    Canada: "CAD",
    Australia: "AUD",
    China: "CNY",
    Germany: "EUR",
    France: "EUR",
    Russia: "RUB",
    Brazil: "BRL",
    SouthAfrica: "ZAR",
    Singapore: "SGD",
    Switzerland: "CHF"
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          "https://api.currencyapi.com/v3/latest?apikey=cur_live_WCAr0tgyf89aHhlV7MfNiMfjN4n3iI3rOOqywOd0"
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        if (data && data.data) {
          const rateObj = {};
          for (const [currency, valueObj] of Object.entries(data.data)) {
            rateObj[currency] = valueObj.value;
          }
          setRates(rateObj);
          setBaseCurrency(data.meta.base || "USD");
          setError("");
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError("⚠️ Failed to load currency data: " + err.message);
      }
    };

    fetchRates();
  }, []);

  const handleConvert = () => {
    const from = countryToCurrency[baseCountry];
    const to = countryToCurrency[targetCountry];

    if (!from || !to || !amount) {
      alert("Please fill all fields.");
      return;
    }

    if (!rates[from] || !rates[to]) {
      alert("Currency data not available.");
      return;
    }

    const amountInBase = amount / rates[from];
    const finalAmount = amountInBase * rates[to];
    setConverted(finalAmount);
  };

  const formGroupStyle = { marginBottom: "15px", textAlign: "left" };
  const labelStyle = { fontWeight: "bold", display: "block", marginBottom: "5px" };
  const inputStyle = { padding: "6px", width: "100%" };
  const selectStyle = { padding: "6px", width: "100%" };

  return (
    <div
      style={{
        background:
          "url('https://i.pinimg.com/originals/ba/4f/18/ba4f18a092adaf394429dc56d1f955d0.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          padding: "25px",
          background: "rgb(232,238,180)",
          color: "black",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 0 12px rgba(0,0,0,0.3)"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Currency Converter
        </h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={formGroupStyle}>
          <label style={labelStyle}>From Country:</label>
          <select
            value={baseCountry}
            onChange={(e) => setBaseCountry(e.target.value)}
            style={selectStyle}
          >
            <option value="" hidden>Select</option>
            {Object.keys(countryToCurrency).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>To Country:</label>
          <select
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
            style={selectStyle}
          >
            <option value="" hidden>Select</option>
            {Object.keys(countryToCurrency).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          style={{
            padding: "10px 20px",
            backgroundColor: "#78c28d",
            border: "none",
            borderRadius: "6px",
            width: "100%",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Convert
        </button>

        {converted !== null && (
          <h2 style={{ marginTop: "20px", textAlign: "center" }}>
            Converted Amount: {converted.toFixed(2)}{" "}
            {countryToCurrency[targetCountry]}
          </h2>
        )}
      </div>
    </div>
  );
}

export default Temp;
